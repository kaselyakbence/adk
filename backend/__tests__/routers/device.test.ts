import express from "express";
import request from "supertest";

// The router imports `prismaClient` from "../index" (backend/src/index.ts),
// which has top-level side effects (app.listen, startPushJob) we don't want
// running in a test process. Mocking the whole module - instead of just
// "@prisma/client" - keeps those side effects from ever executing, since
// Jest substitutes this mock for any import of that path before the real
// file is evaluated.
jest.mock("../../src/index", () => ({
  prismaClient: {
    device: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
    pushSubscription: {
      deleteMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

import { prismaClient } from "../../src/index";
import DeviceRouter from "../../src/routers";

const mockPrisma = prismaClient as unknown as {
  device: { findMany: jest.Mock; update: jest.Mock };
  pushSubscription: { deleteMany: jest.Mock; create: jest.Mock };
};

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use("/device", DeviceRouter);
  return app;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockPrisma.device.update.mockResolvedValue(undefined);
  mockPrisma.pushSubscription.deleteMany.mockResolvedValue(undefined);
  mockPrisma.pushSubscription.create.mockResolvedValue(undefined);
});

describe("GET /device/all", () => {
  it("returns the seeded devices", async () => {
    const devices = [{ id: 1, type: "washer", number: 1, owner: "Alex" }];
    mockPrisma.device.findMany.mockResolvedValue(devices);

    const res = await request(buildApp()).get("/device/all");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(devices);
  });

  it("survives an empty table", async () => {
    mockPrisma.device.findMany.mockResolvedValue([]);

    const res = await request(buildApp()).get("/device/all");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns an empty array rather than crashing on a DB error", async () => {
    mockPrisma.device.findMany.mockRejectedValue(
      new Error("connection refused"),
    );

    const res = await request(buildApp()).get("/device/all");

    expect(res.status).toBe(400);
    expect(res.body).toEqual([]);
  });
});

describe("POST /device/:id/update", () => {
  // Decision table from assets/test-strategy.md §7.3: owner present x
  // hours valid x minutes valid.
  it("accepts a valid request and returns 201", async () => {
    const res = await request(buildApp())
      .post("/device/1/update")
      .send({ hours: 1, minutes: 30, owner: "Alex" });

    expect(res.status).toBe(201);
    expect(mockPrisma.device.update).toHaveBeenCalledTimes(1);
    expect(mockPrisma.device.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
        data: expect.objectContaining({ owner: "Alex" }),
      }),
    );
  });

  it("clears any pending push subscription for that device on a successful update", async () => {
    await request(buildApp())
      .post("/device/1/update")
      .send({ hours: 1, minutes: 30, owner: "Alex" });

    expect(mockPrisma.pushSubscription.deleteMany).toHaveBeenCalledWith({
      where: { deviceId: 1 },
    });
  });

  it("rejects a missing owner and does not touch the database", async () => {
    const res = await request(buildApp())
      .post("/device/1/update")
      .send({ hours: 1, minutes: 30 });

    expect(res.status).toBe(403);
    expect(mockPrisma.device.update).not.toHaveBeenCalled();
  });

  it("rejects non-numeric hours", async () => {
    const res = await request(buildApp())
      .post("/device/1/update")
      .send({ hours: "abc", minutes: 30, owner: "Alex" });

    expect(res.status).toBe(403);
    expect(mockPrisma.device.update).not.toHaveBeenCalled();
  });

  it("rejects non-numeric minutes", async () => {
    const res = await request(buildApp())
      .post("/device/1/update")
      .send({ hours: 1, minutes: "abc", owner: "Alex" });

    expect(res.status).toBe(403);
    expect(mockPrisma.device.update).not.toHaveBeenCalled();
  });

  it("computes start/end from the server clock when the client doesn't send dates", async () => {
    const before = Date.now();
    await request(buildApp())
      .post("/device/1/update")
      .send({ hours: 0, minutes: 30, owner: "Alex" });
    const after = Date.now();

    const { data } = mockPrisma.device.update.mock.calls[0][0];
    const start = new Date(data.start_date).getTime();
    const end = new Date(data.end_date).getTime();

    expect(start).toBeGreaterThanOrEqual(before);
    expect(start).toBeLessThanOrEqual(after);
    // 30 minutes, give or take the test's own execution time.
    expect(end - start).toBeGreaterThanOrEqual(30 * 60 * 1000 - 1000);
    expect(end - start).toBeLessThanOrEqual(30 * 60 * 1000 + 1000);
  });

  it("honors client-supplied start/end dates instead of the server's own clock", async () => {
    // This is what makes an offline-queued booking (frontend/src/lib/
    // offlineQueue.ts) resolve to the moment Start was actually pressed,
    // not whenever the queued request happens to reach the server.
    const start_date = new Date(Date.now() - 3600_000).toISOString();
    const end_date = new Date(Date.now() + 1800_000).toISOString();

    await request(buildApp())
      .post("/device/1/update")
      .send({ hours: 1, minutes: 30, owner: "Alex", start_date, end_date });

    const { data } = mockPrisma.device.update.mock.calls[0][0];
    expect(data.start_date).toBe(start_date);
    expect(data.end_date).toBe(end_date);
  });

  it("falls back to server-computed dates when client dates are unparseable", async () => {
    await request(buildApp()).post("/device/1/update").send({
      hours: 1,
      minutes: 0,
      owner: "Alex",
      start_date: "not-a-date",
      end_date: "also-not-a-date",
    });

    const { data } = mockPrisma.device.update.mock.calls[0][0];
    expect(new Date(data.start_date).toString()).not.toBe("Invalid Date");
    expect(new Date(data.end_date).toString()).not.toBe("Invalid Date");
  });

  it("overwrites rather than rejecting a second booking on the same device", async () => {
    // The app's documented honor-system behavior: there's no "already
    // booked" check at all - every update just applies, replacing whatever
    // was there. This test exists to make that a guarantee, not an accident.
    const app = buildApp();
    await request(app)
      .post("/device/1/update")
      .send({ hours: 1, minutes: 0, owner: "Alex" });
    await request(app)
      .post("/device/1/update")
      .send({ hours: 0, minutes: 15, owner: "Jordan" });

    expect(mockPrisma.device.update).toHaveBeenCalledTimes(2);
    expect(mockPrisma.device.update.mock.calls[1][0].data.owner).toBe("Jordan");
  });

  it("auto-clears a stale broken flag on a successful Start", async () => {
    // Settled default: someone just used the machine, so a leftover
    // "broken" report is assumed out of date.
    await request(buildApp())
      .post("/device/1/update")
      .send({ hours: 1, minutes: 30, owner: "Alex" });

    const { data } = mockPrisma.device.update.mock.calls[0][0];
    expect(data).toEqual(
      expect.objectContaining({
        broken: false,
        brokenReason: null,
        brokenAt: null,
      }),
    );
  });

  it("does not touch the broken flag when the Start request is rejected", async () => {
    await request(buildApp())
      .post("/device/1/update")
      .send({ hours: 0, minutes: 0, owner: "Alex" });

    expect(mockPrisma.device.update).not.toHaveBeenCalled();
  });

  it("returns 403 rather than crashing when the update throws (e.g. unknown device id)", async () => {
    mockPrisma.device.update.mockRejectedValue(
      new Error("Record to update not found"),
    );

    const res = await request(buildApp())
      .post("/device/999999/update")
      .send({ hours: 1, minutes: 0, owner: "Alex" });

    expect(res.status).toBe(403);
  });

  it("returns 403 (relying on Prisma's own argument validation) for a non-numeric device id", async () => {
    // req.params.id is always a truthy string, so the route's own guard
    // never catches this - deviceId ends up as parseInt("abc") === NaN,
    // and it's real Prisma throwing on an invalid `where: { id: NaN }`
    // that the catch block turns into a 403. Simulated here since the
    // mock has no argument validation of its own.
    mockPrisma.device.update.mockRejectedValueOnce(
      new Error("Invalid value for id: expected Int, got NaN"),
    );

    const res = await request(buildApp())
      .post("/device/abc/update")
      .send({ hours: 1, minutes: 0, owner: "Alex" });

    expect(res.status).toBe(403);
  });

  // --- Server-side bounds matching the frontend ---
  //
  // Mirrors the client-side validation TimerModal already enforces
  // (the F4/F5 fixes) via isValidBookingDuration() in the router - closing
  // the gap where a direct API call bypassed the UI's checks entirely.
  describe("server-side bounds matching the frontend", () => {
    // The companion field is pinned to a non-zero valid value (minutes: 30
    // here, hours: 1 below) specifically so that testing one field's own
    // boundary doesn't collide with the separate "total duration must be
    // > 0" rule - hours=0 paired with minutes=0 would otherwise fail for
    // a different reason than the one this table is isolating.
    describe.each([
      { hours: -1, valid: false },
      { hours: 0, valid: true },
      { hours: 3, valid: true },
      { hours: 4, valid: false },
    ])("hours=$hours (BVA on the 0-3 range)", ({ hours, valid }) => {
      it(`${valid ? "is accepted" : "is rejected"}`, async () => {
        const res = await request(buildApp())
          .post("/device/1/update")
          .send({ hours, minutes: 30, owner: "Alex" });

        expect(res.status).toBe(valid ? 201 : 403);
      });
    });

    describe.each([
      { minutes: -1, valid: false },
      { minutes: 0, valid: true },
      { minutes: 60, valid: true },
      { minutes: 61, valid: false },
    ])("minutes=$minutes (BVA on the 0-60 range)", ({ minutes, valid }) => {
      it(`${valid ? "is accepted" : "is rejected"}`, async () => {
        const res = await request(buildApp())
          .post("/device/1/update")
          .send({ hours: 1, minutes, owner: "Alex" });

        expect(res.status).toBe(valid ? 201 : 403);
      });
    });

    it("rejects a zero-duration booking (0h0m) - mirrors F5", async () => {
      const res = await request(buildApp())
        .post("/device/1/update")
        .send({ hours: 0, minutes: 0, owner: "Alex" });

      expect(res.status).toBe(403);
    });

    it("rejects an empty-string owner", async () => {
      const res = await request(buildApp())
        .post("/device/1/update")
        .send({ hours: 1, minutes: 0, owner: "" });

      expect(res.status).toBe(403);
    });

    it("rejects a whitespace-only owner", async () => {
      const res = await request(buildApp())
        .post("/device/1/update")
        .send({ hours: 1, minutes: 0, owner: "   " });

      expect(res.status).toBe(403);
    });

    it.each([
      { hours: 1.5, minutes: 0 },
      { hours: 1, minutes: 30.5 },
    ])(
      "rejects fractional duration values (hours=$hours minutes=$minutes)",
      async ({ hours, minutes }) => {
        const res = await request(buildApp())
          .post("/device/1/update")
          .send({ hours, minutes, owner: "Alex" });

        expect(res.status).toBe(403);
      },
    );

    // The current `!isNaN(x)` check coerces its argument before testing,
    // so several non-number types slip through as "valid" today - each
    // of these is accepted by the real route right now, which is exactly
    // the leakiness a stricter (e.g. typeof x === "number") check would
    // close.
    it.each([
      ["the boolean true", true],
      ["null", null],
      ["an empty array", [] as unknown],
    ])("rejects hours given as %s", async (_label, weirdHours) => {
      const res = await request(buildApp())
        .post("/device/1/update")
        .send({ hours: weirdHours, minutes: 0, owner: "Alex" });

      expect(res.status).toBe(403);
    });
  });
});

describe("POST /device/:id/subscribe", () => {
  it("accepts a well-formed subscription", async () => {
    const res = await request(buildApp())
      .post("/device/1/subscribe")
      .send({
        endpoint: "https://push.example/abc",
        keys: { p256dh: "key1", auth: "key2" },
      });

    expect(res.status).toBe(201);
    expect(mockPrisma.pushSubscription.create).toHaveBeenCalledWith({
      data: {
        deviceId: 1,
        endpoint: "https://push.example/abc",
        p256dh: "key1",
        auth: "key2",
      },
    });
  });

  it("rejects a missing endpoint", async () => {
    const res = await request(buildApp())
      .post("/device/1/subscribe")
      .send({ keys: { p256dh: "key1", auth: "key2" } });

    expect(res.status).toBe(403);
    expect(mockPrisma.pushSubscription.create).not.toHaveBeenCalled();
  });

  it("rejects a missing keys.p256dh", async () => {
    const res = await request(buildApp())
      .post("/device/1/subscribe")
      .send({ endpoint: "https://push.example/abc", keys: { auth: "key2" } });

    expect(res.status).toBe(403);
  });

  it("rejects a missing keys.auth", async () => {
    const res = await request(buildApp())
      .post("/device/1/subscribe")
      .send({ endpoint: "https://push.example/abc", keys: { p256dh: "key1" } });

    expect(res.status).toBe(403);
  });

  it("rejects when keys is missing entirely", async () => {
    const res = await request(buildApp())
      .post("/device/1/subscribe")
      .send({ endpoint: "https://push.example/abc" });

    expect(res.status).toBe(403);
    expect(mockPrisma.pushSubscription.create).not.toHaveBeenCalled();
  });

  it("rejects a non-string endpoint", async () => {
    const res = await request(buildApp())
      .post("/device/1/subscribe")
      .send({ endpoint: 12345, keys: { p256dh: "key1", auth: "key2" } });

    expect(res.status).toBe(403);
  });

  it("returns 403 rather than crashing when the DB call throws", async () => {
    mockPrisma.pushSubscription.create.mockRejectedValue(
      new Error("FK constraint failed"),
    );

    const res = await request(buildApp())
      .post("/device/999999/subscribe")
      .send({
        endpoint: "https://push.example/abc",
        keys: { p256dh: "key1", auth: "key2" },
      });

    expect(res.status).toBe(403);
  });
});

describe("POST /device/:id/report-broken", () => {
  it("flags the device with the given reason and the current time", async () => {
    const before = Date.now();
    const res = await request(buildApp())
      .post("/device/3/report-broken")
      .send({ reason: "Door won't close" });
    const after = Date.now();

    expect(res.status).toBe(201);
    expect(mockPrisma.device.update).toHaveBeenCalledTimes(1);

    const { where, data } = mockPrisma.device.update.mock.calls[0][0];
    expect(where).toEqual({ id: 3 });
    expect(data.broken).toBe(true);
    expect(data.brokenReason).toBe("Door won't close");
    expect(data.brokenAt).toBeInstanceOf(Date);
    expect(data.brokenAt.getTime()).toBeGreaterThanOrEqual(before);
    expect(data.brokenAt.getTime()).toBeLessThanOrEqual(after);
  });

  it("accepts a report with no body at all - the reason is optional", async () => {
    const res = await request(buildApp()).post("/device/3/report-broken");

    expect(res.status).toBe(201);
    const { data } = mockPrisma.device.update.mock.calls[0][0];
    expect(data.broken).toBe(true);
    expect(data.brokenReason).toBeNull();
  });

  it.each([
    ["an empty string", ""],
    ["whitespace only", "   "],
    ["null", null],
  ])("stores no reason when it is %s", async (_label, reason) => {
    const res = await request(buildApp())
      .post("/device/3/report-broken")
      .send({ reason });

    expect(res.status).toBe(201);
    expect(
      mockPrisma.device.update.mock.calls[0][0].data.brokenReason,
    ).toBeNull();
  });

  it("trims surrounding whitespace off the reason", async () => {
    await request(buildApp())
      .post("/device/3/report-broken")
      .send({ reason: "  Leaking  " });

    expect(mockPrisma.device.update.mock.calls[0][0].data.brokenReason).toBe(
      "Leaking",
    );
  });

  it("cuts an overlong reason to 200 characters instead of rejecting it", async () => {
    const res = await request(buildApp())
      .post("/device/3/report-broken")
      .send({ reason: "x".repeat(500) });

    expect(res.status).toBe(201);
    expect(
      mockPrisma.device.update.mock.calls[0][0].data.brokenReason,
    ).toHaveLength(200);
  });

  it.each([
    ["a number", 42],
    ["an object", { text: "broken" }],
    ["an array", ["broken"]],
  ])("rejects a reason given as %s", async (_label, reason) => {
    const res = await request(buildApp())
      .post("/device/3/report-broken")
      .send({ reason });

    expect(res.status).toBe(403);
    expect(mockPrisma.device.update).not.toHaveBeenCalled();
  });

  it("returns 403 rather than crashing when the update throws (e.g. unknown device id)", async () => {
    mockPrisma.device.update.mockRejectedValue(
      new Error("Record to update not found"),
    );

    const res = await request(buildApp())
      .post("/device/999999/report-broken")
      .send({ reason: "Broken" });

    expect(res.status).toBe(403);
  });
});

describe("POST /device/:id/clear-broken", () => {
  it("resets all three broken fields to their defaults", async () => {
    const res = await request(buildApp()).post("/device/3/clear-broken");

    expect(res.status).toBe(201);
    expect(mockPrisma.device.update).toHaveBeenCalledWith({
      where: { id: 3 },
      data: { broken: false, brokenReason: null, brokenAt: null },
    });
  });

  it("leaves the booking itself (start/end/owner) alone", async () => {
    await request(buildApp()).post("/device/3/clear-broken");

    const { data } = mockPrisma.device.update.mock.calls[0][0];
    expect(data).not.toHaveProperty("start_date");
    expect(data).not.toHaveProperty("end_date");
    expect(data).not.toHaveProperty("owner");
  });

  it("succeeds on a device that isn't flagged - clearing is idempotent", async () => {
    const app = buildApp();
    const first = await request(app).post("/device/3/clear-broken");
    const second = await request(app).post("/device/3/clear-broken");

    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
  });

  it("returns 403 rather than crashing when the update throws (e.g. unknown device id)", async () => {
    mockPrisma.device.update.mockRejectedValue(
      new Error("Record to update not found"),
    );

    const res = await request(buildApp()).post("/device/999999/clear-broken");

    expect(res.status).toBe(403);
  });
});

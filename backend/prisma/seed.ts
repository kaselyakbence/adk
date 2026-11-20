import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Placeholder demo names only — never real residents' names, since this
// data can show up on-screen during a live pitch before the dorm has
// approved the project.
const DEMO_NAMES = [
  "Alex",
  "Jordan",
  "Sam",
  "Maria",
  "Lukas",
  "Sofia",
  "Noah",
  "Emma",
  "Finn",
  "Lea",
  "Milan",
  "Nora",
];

interface DeviceSeed {
  number: number;
  type: "washer" | "dryer";
}

const DEVICES: DeviceSeed[] = [
  ...Array.from({ length: 5 }, (_, i) => ({
    number: i + 1,
    type: "washer" as const,
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    number: i + 6,
    type: "dryer" as const,
  })),
];

interface EventSeed {
  title: string;
  location: string;
  // Relative to the day the seed runs, so a reseed always yields a mix of
  // past and upcoming events instead of everything drifting into "past".
  daysFromToday: number;
  hour: number;
  // How many days before the event it was "posted" (shown as the post date).
  postedDaysBefore: number;
}

// Titles/places from the dorm's existing Instagram posts; everything else
// (description, poster) is deliberately placeholder - none of the original
// post content is reused. Dates are generated, see EventSeed.
const PLACEHOLDER_DESCRIPTION =
  "Placeholder description - the details for this event will go here: what's happening, what to bring and who to ask.";

const EVENTS: EventSeed[] = [
  {
    title: "ADK Party 26",
    location: "Keller, House 15",
    daysFromToday: -25,
    hour: 21,
    postedDaysBefore: 10,
  },
  {
    title: "ADK Picnic",
    location: "Yard",
    daysFromToday: 4,
    hour: 11,
    postedDaysBefore: 10,
  },
  {
    title: "Trivia Night",
    location: "Keller, House 15",
    daysFromToday: 12,
    hour: 19,
    postedDaysBefore: 10,
  },
];

// That day (counted from today) at `hour`:00 *Berlin* time, whatever the
// timezone of the machine running the seed (the server container is UTC).
function berlinDateAt(daysFromToday: number, hour: number): Date {
  const day = new Date(Date.now() + daysFromToday * 86_400_000);
  // YYYY-MM-DD of that day as seen in Berlin.
  const ymd = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(day);
  const hh = String(hour).padStart(2, "0");

  // Treat the wall-clock time as UTC first, then shift by Berlin's offset
  // on that date (+1h or +2h depending on DST).
  const asUtc = new Date(`${ymd}T${hh}:00:00Z`);
  const berlinWall = new Date(
    asUtc.toLocaleString("en-US", { timeZone: "Europe/Berlin" }),
  );
  const utcWall = new Date(asUtc.toLocaleString("en-US", { timeZone: "UTC" }));
  return new Date(asUtc.getTime() - (berlinWall.getTime() - utcWall.getTime()));
}

// Placeholder reasons for the one demo machine the seed flags as broken.
const BROKEN_REASONS = [
  "Door won't lock",
  "Stops mid-cycle",
  "Leaking water",
  "Display stays blank",
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomName(): string {
  return DEMO_NAMES[Math.floor(Math.random() * DEMO_NAMES.length)];
}

function minutesFromNow(minutes: number): Date {
  return new Date(Date.now() + minutes * 60_000);
}

async function main() {
  // TRUNCATE (not deleteMany) also resets the id sequence back to 1, so a
  // re-seeded device keeps the same id the printed QR codes point at.
  // PushSubscription has to be truncated in the same statement (Postgres
  // refuses otherwise, since it references Device) - a clean reset should
  // drop stale subscriptions tied to bookings that no longer exist anyway.
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "Device", "PushSubscription", "Event", "EventSubscription" RESTART IDENTITY;`,
  );

  for (const event of EVENTS) {
    await prisma.event.create({
      data: {
        title: event.title,
        location: event.location,
        description: PLACEHOLDER_DESCRIPTION,
        startDate: berlinDateAt(event.daysFromToday, event.hour),
        // Never "posted" in the future - an event far ahead was announced
        // at the latest today.
        createdAt: new Date(
          Math.min(
            berlinDateAt(
              event.daysFromToday - event.postedDaysBefore,
              12,
            ).getTime(),
            Date.now(),
          ),
        ),
      },
    });
  }

  const idleDeviceIds: number[] = [];

  for (const device of DEVICES) {
    const isRunning = Math.random() < 0.5;
    const durationMinutes =
      device.type === "washer" ? randomInt(30, 90) : randomInt(40, 75);

    // Running: started somewhere between just now and (duration - 5) min
    // ago, so there's always at least 5 minutes left on the clock.
    // Available: finished anywhere from 5 minutes to 3 hours ago.
    const startedMinutesAgo = isRunning
      ? randomInt(0, durationMinutes - 5)
      : durationMinutes + randomInt(5, 180);

    const created = await prisma.device.create({
      data: {
        number: device.number,
        type: device.type,
        owner: randomName(),
        start_date: minutesFromNow(-startedMinutesAgo),
        end_date: minutesFromNow(durationMinutes - startedMinutesAgo),
      },
    });
    if (!isRunning) idleDeviceIds.push(created.id);
  }

  // One random idle machine is flagged broken, so the demo shows the state.
  // Never a running one - a machine mid-cycle has obviously been working.
  // (If every machine happens to be running, nothing gets flagged.)
  if (idleDeviceIds.length > 0) {
    const id = idleDeviceIds[randomInt(0, idleDeviceIds.length - 1)];
    await prisma.device.update({
      where: { id },
      data: {
        broken: true,
        brokenReason: BROKEN_REASONS[randomInt(0, BROKEN_REASONS.length - 1)],
        brokenAt: minutesFromNow(-randomInt(10, 240)),
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

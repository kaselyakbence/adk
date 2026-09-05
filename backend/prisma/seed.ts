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
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Device" RESTART IDENTITY;`);

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

    await prisma.device.create({
      data: {
        number: device.number,
        type: device.type,
        owner: randomName(),
        start_date: minutesFromNow(-startedMinutesAgo),
        end_date: minutesFromNow(durationMinutes - startedMinutesAgo),
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

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  for (let i = 1; i < 6; i++) {
    await prisma.device.create({
      data: {
        number: i,
        type: "washer",
        owner: "",
        start_date: null,
        end_date: new Date().toISOString(),
      },
    });
  }

  for (let i = 6; i < 9; i++) {
    await prisma.device.create({
      data: {
        number: i,
        type: "dryer",
        owner: "",
        start_date: null,
        end_date: new Date().toISOString(),
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

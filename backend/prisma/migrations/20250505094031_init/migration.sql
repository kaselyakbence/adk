-- CreateTable
CREATE TABLE "Device" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "owner" TEXT NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

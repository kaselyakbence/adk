-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "broken" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "brokenAt" TIMESTAMP(3),
ADD COLUMN     "brokenReason" TEXT;

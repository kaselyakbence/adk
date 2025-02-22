/*
  Warnings:

  - You are about to drop the column `name` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `name_ge` on the `Device` table. All the data in the column will be lost.
  - Added the required column `number` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Made the column `end_date` on table `Device` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Device" DROP COLUMN "name",
DROP COLUMN "name_ge",
ADD COLUMN     "number" INTEGER NOT NULL,
ALTER COLUMN "end_date" SET NOT NULL;

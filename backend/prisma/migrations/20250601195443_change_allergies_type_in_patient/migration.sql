/*
  Warnings:

  - The `allergies` column on the `Patient` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "allergies",
ADD COLUMN     "allergies" TEXT[];

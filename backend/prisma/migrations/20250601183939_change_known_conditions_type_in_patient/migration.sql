/*
  Warnings:

  - You are about to drop the column `date_of_birth` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Patient` table. All the data in the column will be lost.
  - The `known_conditions` column on the `Patient` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "date_of_birth",
DROP COLUMN "gender",
DROP COLUMN "known_conditions",
ADD COLUMN     "known_conditions" TEXT[];

/*
  Warnings:

  - You are about to drop the column `endMinute` on the `DoctorAvailability` table. All the data in the column will be lost.
  - You are about to drop the column `startMinute` on the `DoctorAvailability` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `DoctorAvailability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `DoctorAvailability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DoctorAvailability" DROP COLUMN "endMinute",
DROP COLUMN "startMinute",
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL;

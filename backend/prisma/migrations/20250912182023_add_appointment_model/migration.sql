/*
  Warnings:

  - You are about to drop the column `startAt` on the `Appointment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[doctorId,appointmentDate,appointmentTime]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `appointmentDate` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appointmentTime` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Appointment_doctorId_startAt_idx";

-- DropIndex
DROP INDEX "Appointment_doctorId_startAt_key";

-- DropIndex
DROP INDEX "Appointment_patientId_startAt_idx";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "startAt",
ADD COLUMN     "appointmentDate" DATE NOT NULL,
ADD COLUMN     "appointmentTime" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Appointment_patientId_appointmentDate_idx" ON "Appointment"("patientId", "appointmentDate");

-- CreateIndex
CREATE INDEX "Appointment_doctorId_appointmentDate_idx" ON "Appointment"("doctorId", "appointmentDate");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_doctorId_appointmentDate_appointmentTime_key" ON "Appointment"("doctorId", "appointmentDate", "appointmentTime");

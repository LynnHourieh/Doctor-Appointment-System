import express from "express";
import { addAppointment, getAllAppointments, getAppointmentsById, updateAppointmentStatus, updatedAppointment } from "../controllers/appointment.controller";


const router = express.Router();

router.get("/", getAllAppointments);
router.get("/:id", getAppointmentsById);
router.post("/", addAppointment);
router.patch("/:id/status", updateAppointmentStatus);
router.patch("/:id", updatedAppointment);


export default router;

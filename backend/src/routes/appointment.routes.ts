import express from "express";
import { addAppointment, getAllAppointments, getAppointmentsById } from "../controllers/appointment.controller";


const router = express.Router();

router.get("/", getAllAppointments);
router.get("/:id", getAppointmentsById);
router.post("/", addAppointment);


export default router;

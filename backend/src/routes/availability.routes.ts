import express from "express";
import {   getAvailabilitiesById,updateAvailabilityRecord } from "../controllers/availability.controller";


const router = express.Router();

router.get("/:id", getAvailabilitiesById);
router.put("/:id", updateAvailabilityRecord);


export default router;

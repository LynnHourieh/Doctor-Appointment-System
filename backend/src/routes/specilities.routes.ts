import express from "express";
import { getAllSpecialties } from "../controllers/specilities.controller";


const router = express.Router();

router.get("/", getAllSpecialties);


export default router;

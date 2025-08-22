import { Router } from "express";
import { getAllDoctors, getAllPatients, getPatientById, getUserProfile, registerUser, updateUserProfile, getDoctorById, updateProfile } from "../controllers/user.controller.js";
import { loginUser, logoutUser } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authenticateToken, logoutUser)
router.get("/profile", authenticateToken, getUserProfile);
router.put("/profile", authenticateToken, updateUserProfile);
router.get("/patients", authenticateToken, getAllPatients);
router.get("/patient-details/:id", authenticateToken, getPatientById);
router.get("/doctors", authenticateToken, getAllDoctors);
router.get("/doctor-details/:id", authenticateToken, getDoctorById);
router.put("/update-profile", authenticateToken, updateProfile);

export default router;

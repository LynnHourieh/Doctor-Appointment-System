import { Router } from "express";
import {registerUser}  from "../controllers/user.controller.js";
import { loginUser, logoutUser } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authenticateToken,logoutUser)


export default router;

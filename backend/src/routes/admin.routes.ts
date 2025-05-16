import express from "express";
import { getPendingUsers, updateUserStatus } from "../controllers/admin.controller.js";
import { authenticateToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/auth.js";
const router = express.Router();
router.use(authenticateToken)// Apply to all admin routes
router.use(isAdmin);
router.get("/users/pending", getPendingUsers);
router.patch("/users/:id", updateUserStatus); 

export default router;

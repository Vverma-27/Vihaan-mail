import express from "express";
import { registerUser } from "../controllers/authController";

const router = express.Router();

// Register user route
router.post("/register", registerUser);

export default router;

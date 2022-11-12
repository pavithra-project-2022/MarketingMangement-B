import express from "express";
import { login, OtpVerification, register,verifyEmail } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.get("/:id/verify/:token/", verifyEmail)
router.post("/verifyOtp",OtpVerification)

export default router
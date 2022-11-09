import express from "express";
import { passwordReset, verifyResetLink, setPassword } from "../controllers/passwordReset.js";

const router = express.Router();

router.post("/", passwordReset)

router.get("/:id/:token",verifyResetLink)

router.post("/:id/:token", setPassword)

export default router



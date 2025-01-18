import express from "express";
import { signup } from "../services/authService.js";
import { signupValidator } from "../utils/authValidator.js";

const router = express.Router();

router.post("/signup", signupValidator, signup);

export default router;

import express from "express";
import { signup, signin } from "../services/authService.js";
import {
  signupValidator,
  signinValidator,
} from "../utils/validators/authValidator.js";
const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/signin", signinValidator, signin);
export default router;

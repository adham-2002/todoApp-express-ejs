import express from "express";
import {
  signup,
  signin,
  forgetPassword,
  verifyPasswordResetCode,
  resetPassword,
  refreshToken,
  logout,
} from "../services/authService.js";
import {
  signupValidator,
  signinValidator,
  forgetPasswordValidator,
  verifyPasswordValidator,
  resetPasswordValidator,
} from "../utils/validators/authValidator.js";
const router = express.Router();

router
  .post("/signup", signupValidator, signup)
  .post("/signin", signinValidator, signin)
  .post("/forgetPassword", forgetPasswordValidator, forgetPassword)
  .post("/verifyPassword", verifyPasswordValidator, verifyPasswordResetCode)
  .post("/refresh-token", refreshToken)
  .post("/logout", logout)
  .put("/reset-password", resetPasswordValidator, resetPassword);
export default router;

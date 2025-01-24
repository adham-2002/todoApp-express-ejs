import express from "express";
import { defaultConfig, criticalConfig } from "../config/rateLimiterConfig.js";
import apiRateLimiter from "../middlewares/rateLimiter.js";
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

// Apply rate limiting to specific routes
router
  .post("/signup", apiRateLimiter(defaultConfig), signupValidator, signup) // Default rate limit
  .post("/signin", apiRateLimiter(defaultConfig), signinValidator, signin) // Default rate limit
  .post(
    "/forgetPassword",
    apiRateLimiter(criticalConfig), //! Critical API rate limit
    forgetPasswordValidator,
    forgetPassword
  )
  .post(
    "/verifyPassword",
    apiRateLimiter(criticalConfig), //! Critical API rate limit
    verifyPasswordValidator,
    verifyPasswordResetCode
  )
  .post("/refresh-token", apiRateLimiter(defaultConfig), refreshToken) // Default rate limit
  .post("/logout", apiRateLimiter(defaultConfig), logout) // Default rate limit
  .put(
    "/reset-password",
    apiRateLimiter(criticalConfig), //! Critical API rate limit
    resetPasswordValidator,
    resetPassword
  );

export default router;

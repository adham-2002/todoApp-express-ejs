import { rateLimit } from "express-rate-limit";
import ApiError from "../utils/apiError.js";
const apiRateLimiter = (options) =>
  rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes
    limit: options.limit || 100, // 100 requests per windowMs
    message: options.message || "Too many requests, please try again later.",
    standardHeaders: true, // return rate limit info in the `RateLimit` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res, next) => {
      return next(new ApiError(options.message, 429));
    },
  });
export default apiRateLimiter;

// make each one seprate each config for rate limiting
export const defaultConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // 100 requests per windowMs
  message: "Too many requests, please try again later.",
};
export const criticalConfig = {
  windowMs: 60 * 60 * 1000, // 60 minutes
  limit: 3, // 3 requests per windowMs
  message: "Too many requests, please try again later.",
};

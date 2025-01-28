import "dotenv/config"; // Load environment variables
import cors from "cors";
import colors from "colors"; // Colorful logs
import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/db.js"; // Database connection
import globalError from "./middlewares/errorMiddleware.js"; // Global error handler
import authRouter from "./routes/authRoute.js"; // Auth routes
import taskRouter from "./routes/taskRoute.js"; // Task routes
import categoryRouter from "./routes/categoryRoute.js"; // Category routes
import seedPredefinedCategories from "./scripts/seedpredefinedCategories.js";
import envVarsSchema from "./config/envValidation.js"; // Joi schema for env variables
import apiRateLimiter from "./middlewares/rateLimiter.js";
import { defaultConfig } from "./config/rateLimiterConfig.js";
import xssMiddleware from "./middlewares/xssMiddleware.js";
import mongoSanitize from "express-mongo-sanitize";
import logger from "./utils/logger.js"; // Import the logger
// Validate environment variables
const { error, value: envVars } = envVarsSchema.validate(process.env, {
  allowUnknown: true, // Allow unknown variables
  stripUnknown: true, // Remove unknown variables from the validated object
});
if (error) {
  logger.error(`Config validation error: ${error.message}`);
  throw new Error(`Config validation error: ${error.message}`);
}

// Assign validated environment variables back to process.env
Object.assign(process.env, envVars);

// Connect to the database
connectDB();

// Initialize the app
const app = express();

// Set the view engine to EJS
app.set("view engine", "ejs");

// Middleware
app.use(express.json()); // Parse JSON payloads
app.use(cors()); // Enable CORS
app.use(cookieParser()); // Parse cookies
app.use(helmet()); // Set security headers
app.use(express.static("public")); // Serve static files
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // HTTP request logger in dev mode
}
app.use(apiRateLimiter(defaultConfig)); // Rate limiter
app.use(xssMiddleware); // XSS protection
app.use(mongoSanitize()); // prevent sql injection attacks
// Seed predefined categories if enabled
if (process.env.SEED_ON_STARTUP === "true") {
  seedPredefinedCategories()
    .then(() => console.log("Predefined categories seeded successfully!".green))
    .catch((err) =>
      console.error(`Error seeding categories: ${err.message}`.red)
    );
}

// Routes
app.use("/api/v1/auth", authRouter); // Authentication routes
app.use("/api/v1/tasks", taskRouter); // Task management routes
app.use("/api/v1/categories", categoryRouter); // Category management routes

// Views
app.get("/", (req, res) => {
  res.render("index"); // Render index.ejs
});
app.get("/main", (req, res) => {
  res.render("main"); // Render main.ejs
});
console.log(process.env.NODE_ENV);
// Global Error Handler
app.use(globalError);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(
    `Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`
  );
});

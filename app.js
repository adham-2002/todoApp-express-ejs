import "dotenv/config"; // Load environment variables
import cors from "cors";
import colors from "colors"; // Colorful logs
import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import connectDB from "./config/db.js"; // Database connection
import globalError from "./middlewares/errorMiddleware.js"; // Global error handler
import authRouter from "./routes/authRoute.js"; // Auth routes
import taskRouter from "./routes/taskRoute.js"; // Task routes
import categoryRouter from "./routes/categoryRoute.js"; // Category routes
import seedPredefinedCategories from "./scripts/seedpredefinedCategories.js";
import envVarsSchema from "./config/envValidation.js"; // Joi schema for env variables

const { error, value: envVars } = envVarsSchema.validate(process.env, {
  allowUnknown: true, // Allow unknown variables
  stripUnknown: true, // Remove unknown variables from the validated object
});
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

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
app.use(express.static("public")); // Serve static files
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // HTTP request logger in dev mode
}

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

// Global Error Handler
app.use(globalError);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`
      .cyan
  );
});

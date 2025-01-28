import { json } from "express";
import winston from "winston";

// Define custom log levels
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "blue",
  },
};

// Apply colors to the console logs
winston.addColors(customLevels.colors);

// Create the logger instance
const logger = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      ({ timestamp, level, message, stack }) =>
        `${timestamp} [${level.toUpperCase()}]: ${stack || message}`
    )
  ),
  transports: [
    // Log errors to a file
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    // Log all levels to a combined log file
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

// Add a console transport if in development mode
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      level: "debug",
    })
  );
}

export default logger;

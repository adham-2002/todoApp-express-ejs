import apiError from "../utils/apiError.js";

const sendErrorForDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.isOperational ? err.message : "Something went wrong!",
  });
};

// JWT error handlers
const handleJwtInvalidSignature = () =>
  new apiError("Invalid token, please login again", 401);

const handleJwtExpired = () =>
  new apiError("Your token has expired, please login again", 401);

// System error handlers
const handleSystemErrors = (err) => {
  if (err.code === "ENOENT") {
    return new apiError("File or directory not found", 404);
  }
  if (err.code === "EACCES") {
    return new apiError("Permission denied to access the resource", 403);
  }
  if (err.code === "EMFILE") {
    return new apiError("Too many open files on the server", 503);
  }
  if (err.code === "ECONNREFUSED") {
    return new apiError("Connection refused by the server", 503);
  }
  if (err.code === "ETIMEDOUT") {
    return new apiError("The network operation timed out", 504);
  }
  if (err.code === "EHOSTUNREACH") {
    return new apiError("The host is unreachable", 503);
  }
  return err; // Return the original error if not handled
};

// MongoDB error handlers
const handleMongoErrors = (err) => {
  if (err.name === "ValidationError") {
    return new apiError("Database validation error: " + err.message, 400);
  }
  if (err.name === "CastError") {
    return new apiError(`Invalid ${err.path}: ${err.value}`, 400);
  }
  if (err.name === "MongoNetworkError") {
    return new apiError("Database connection failed", 500);
  }
  return err; // Return the original error if not handled
};

// Global error handler middleware
const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    // Handle known operational errors
    if (err.name === "JsonWebTokenError") {
      err = handleJwtInvalidSignature();
    }
    if (err.name === "TokenExpiredError") {
      err = handleJwtExpired();
    }

    // Handle system-level errors
    err = handleSystemErrors(err);

    // Handle MongoDB-related errors
    err = handleMongoErrors(err);

    // Handle any unexpected errors
    if (!err.isOperational) {
      console.error("Unexpected Error: ", err);
      err = new apiError("Something went wrong!", 500);
    }

    sendErrorForProd(err, res);
  }
};

export default globalError;

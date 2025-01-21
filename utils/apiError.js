// notice you can use http-errors package to create http errors
// this class is responsible about operation errors (error that i can predict)
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
  }
}
export default ApiError;

import mongoose from "mongoose";
import AppError from "../utils/AppError.js";

const globalErrorHandling = (err, req, res, next) => {
  if (!res || !res.status) {
    console.error("Response object is invalid:", res);
    return;
  }

  let error = err;
  console.error(error);

  if (!(error instanceof AppError)) {
    const statusCode = error instanceof mongoose.Error ? 400 : 500;
    const message =
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : error.message || "Internal Server Error";

    error = new AppError(statusCode, message);
  }

  const response = {
    statusCode: error.statusCode || 500,
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  };

  res.status(error.statusCode || 500).json(response);
};

export { globalErrorHandling };

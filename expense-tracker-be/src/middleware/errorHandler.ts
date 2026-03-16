import { logger } from "@/utils/logger.js";
import { NextFunction, Request, Response } from "express";

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function notFound(req: Request, res: Response, next: NextFunction): void {
  const error = new HttpError(404, `Not Found - ${req.originalUrl}`);
  next(error);
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  logger.error("Error:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // PostgreSQL errors
  if (err.code) {
    switch (err.code) {
      case "23505":
        res.status(409).json({
          success: false,
          message: "Duplicate entry detected",
        });
        return;
      case "23503":
        res.status(400).json({
          success: false,
          message: "Foreign key constraint violation",
        });
        return;
      case "23502":
        res.status(400).json({
          success: false,
          message: "Not null constraint violation",
        });
        return;
    }
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
    return;
  }

  if (err.name === "TokenExpiredError") {
    res.status(401).json({
      success: false,
      message: "Token expired",
    });
    return;
  }

  // Default error
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}

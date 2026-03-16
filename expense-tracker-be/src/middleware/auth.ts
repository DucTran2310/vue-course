import { query } from "@/db/client.js";
import { HttpError } from "@/middleware/errorHandler.js";
import { AuthRequest } from "@/types/index.js";
import { getActiveRecordsFilter } from "@/utils/audit.js";
import { logger } from "@/utils/logger.js";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new HttpError(401, "Access token is required");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };

    req.user = { id: decoded.id, email: decoded.email };

    // Verify user still exists and is active
    const userResult = await query(
      `SELECT id, email FROM users WHERE id = $1 AND ${getActiveRecordsFilter()}`,
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      throw new HttpError(401, "User not found or has been deleted");
    }

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      logger.warn("Invalid token:", { error: (error as Error).message });
      next(new HttpError(401, "Invalid or expired token"));
    } else {
      next(error);
    }
  }
}

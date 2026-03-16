import { query } from "@/db/client.js";
import { HttpError } from "@/middleware/errorHandler.js";
import { AuthRequest, User } from "@/types/index.js";
import {
  getActiveRecordsFilter,
  getInsertAuditFields,
  getUpdateAuditFields,
} from "@/utils/audit.js";
import { uploadImageToCloudinary } from "@/utils/cloudinary.js";
import { emailService } from "@/utils/email.js";
import { comparePassword, hashPassword } from "@/utils/hash.js";
import { logger } from "@/utils/logger.js";
import { NextFunction, Response } from "express";
import fs from "fs";
import jwt, { SignOptions } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwk-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Default categories
const expenseCategories = [
  { name: "Ăn uống", icon: "🍽️", color: "#FF6384", type: "expense" },
  { name: "Mua sắm", icon: "🛍️", color: "#36A2EB", type: "expense" },
  { name: "Di chuyển", icon: "🚗", color: "#FFCE56", type: "expense" },
  { name: "Giải trí", icon: "🎮", color: "#4BC0C0", type: "expense" },
  { name: "Hóa đơn", icon: "📄", color: "#9966FF", type: "expense" },
  { name: "Y tế", icon: "🏥", color: "#FF9F40", type: "expense" },
  { name: "Học tập", icon: "📚", color: "#C9CBCF", type: "expense" },
  { name: "Khác", icon: "📝", color: "#7C7C7C", type: "expense" },
];

const incomeCategories = [
  { name: "Lương", icon: "💰", color: "#2ECC71", type: "income" },
  { name: "Thưởng", icon: "🎁", color: "#3498DB", type: "income" },
  { name: "Đầu tư", icon: "📈", color: "#9B59B6", type: "income" },
  { name: "Kinh doanh", icon: "💼", color: "#E74C3C", type: "income" },
  { name: "Khác", icon: "📝", color: "#95A5A6", type: "income" },
];

interface RegisterBody {
  email: string;
  password: string;
  fullName?: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export class AuthController {
  async register(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, fullName }: RegisterBody = req.body;

      // Validate input
      if (!email || !password) {
        throw new HttpError(400, "Email and password are required");
      }

      // Check if user exists (including soft-deleted records)
      const existingUserResult = await query(
        `SELECT id, email, isdeleted FROM users WHERE email = $1`,
        [email]
      );

      if (existingUserResult.rows.length > 0) {
        const existingUser = existingUserResult.rows[0];

        // If user was soft-deleted, allow re-registration by updating the existing record
        if (existingUser.isdeleted) {
          // Hash password
          const hashedPassword = await hashPassword(password);

          // Update existing user to reactivate
          const auditFields = getInsertAuditFields(req);
          const userResult = await query(
            `UPDATE users 
             SET password = $1, full_name = $2, isdeleted = FALSE, deleteddate = NULL, deleteduser = NULL,
                 createduser = $3, updateduser = $4, createddate = CURRENT_TIMESTAMP, updateddate = CURRENT_TIMESTAMP
             WHERE id = $5 RETURNING *`,
            [
              hashedPassword,
              fullName || null,
              auditFields.createduser,
              auditFields.updateduser,
              existingUser.id,
            ]
          );

          const createdUser: User = userResult.rows[0];

          // Create default settings with audit fields (use UPSERT to handle existing settings)
          await query(
            `INSERT INTO settings (user_id, createduser, updateduser) VALUES ($1, $2, $3)
             ON CONFLICT (user_id) 
             DO UPDATE SET isdeleted = FALSE, deleteddate = NULL, deleteduser = NULL, 
                         updateduser = EXCLUDED.updateduser, updateddate = CURRENT_TIMESTAMP`,
            [createdUser.id, auditFields.createduser, auditFields.updateduser]
          );

          // Reactivate existing categories or seed default categories
          // Note: categories table doesn't have user_id, they are global
          // Skip category reactivation for re-registration since categories are global

          // Generate email verification token
          const verificationToken = uuidv4();
          const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

          await query(
            `INSERT INTO email_verification_tokens (id, user_id, email, token, expires_at, createduser, updateduser)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              uuidv4(),
              createdUser.id,
              createdUser.email,
              verificationToken,
              verificationExpiresAt,
              auditFields.createduser,
              auditFields.updateduser,
            ]
          );

          // Send verification email
          const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
          const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;

          try {
            await emailService.sendVerificationEmail(createdUser.email, verificationUrl);
            logger.success(`Verification email sent to: ${createdUser.email}`);
          } catch (emailError) {
            logger.error("Failed to send verification email", {
              email: createdUser.email,
              error: (emailError as Error).message,
            });
          }

          // Generate token
          const token = jwt.sign(
            {
              id: createdUser.id,
              email: createdUser.email,
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN } as SignOptions
          );

          logger.info(`User re-registered: ${createdUser.email}`);

          res.status(201).json({
            success: true,
            message:
              "User registered successfully. Please check your email to verify your account.",
            data: {
              user: {
                id: createdUser.id,
                email: createdUser.email,
                fullName: createdUser.full_name,
                emailVerified: false,
              },
              token,
            },
          });
          return;
        } else {
          // User exists and is active
          throw new HttpError(409, "User with this email already exists");
        }
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user with audit fields
      const auditFields = getInsertAuditFields(req);
      const userResult = await query(
        "INSERT INTO users (email, password, full_name, createduser, updateduser) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [email, hashedPassword, fullName || null, auditFields.createduser, auditFields.updateduser]
      );

      const createdUser: User = userResult.rows[0];

      // Create default settings with audit fields
      await query("INSERT INTO settings (user_id, createduser, updateduser) VALUES ($1, $2, $3)", [
        createdUser.id,
        auditFields.createduser,
        auditFields.updateduser,
      ]);

      // Seed default categories with audit fields
      for (const cat of [...expenseCategories, ...incomeCategories]) {
        await query(
          "INSERT INTO categories (name, icon, color, type, createduser, updateduser) VALUES ($1, $2, $3, $4, $5, $6)",
          [
            cat.name,
            cat.icon,
            cat.color,
            cat.type,
            auditFields.createduser,
            auditFields.updateduser,
          ]
        );
      }

      // Generate email verification token
      const verificationToken = uuidv4();
      const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await query(
        `INSERT INTO email_verification_tokens (id, user_id, email, token, expires_at, createduser, updateduser)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          uuidv4(),
          createdUser.id,
          createdUser.email,
          verificationToken,
          verificationExpiresAt,
          auditFields.createduser,
          auditFields.updateduser,
        ]
      );

      // Send verification email
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;

      try {
        await emailService.sendVerificationEmail(createdUser.email, verificationUrl);
        logger.success(`Verification email sent to: ${createdUser.email}`);
      } catch (emailError) {
        logger.error("Failed to send verification email", {
          email: createdUser.email,
          error: (emailError as Error).message,
        });
        // Continue with registration even if email fails
      }

      // Generate token (user can login, but account needs verification)
      const token = jwt.sign(
        {
          id: createdUser.id,
          email: createdUser.email,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } as SignOptions
      );

      logger.info(`User registered: ${createdUser.email}`);

      res.status(201).json({
        success: true,
        message: "User registered successfully. Please check your email to verify your account.",
        data: {
          user: {
            id: createdUser.id,
            email: createdUser.email,
            fullName: createdUser.full_name,
            emailVerified: false,
          },
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password }: LoginBody = req.body;

      // Validate input
      if (!email || !password) {
        throw new HttpError(400, "Email and password are required");
      }

      // Find user (only active records)
      const userResult = await query(
        `SELECT * FROM users WHERE email = $1 AND ${getActiveRecordsFilter()}`,
        [email]
      );

      if (userResult.rows.length === 0) {
        throw new HttpError(401, "Invalid email or password");
      }

      const user: User = userResult.rows[0];

      // Verify password
      const isValidPassword = await comparePassword(password, user.password);

      if (!isValidPassword) {
        throw new HttpError(401, "Invalid email or password");
      }

      // Check if email is verified (optional - allow login even if not verified)
      if (!user.email_verified) {
        logger.warn(`User logged in without email verification: ${user.email}`);
      }

      // Generate token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } as SignOptions
      );

      logger.info(`User logged in: ${user.email}`);

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            email_verified: user.email_verified || false,
          },
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;

      if (!token) {
        throw new HttpError(400, "Verification token is required");
      }

      // Find the token
      const tokenResult = await query(
        `SELECT * FROM email_verification_tokens 
         WHERE token = $1 AND is_used = FALSE AND expires_at > CURRENT_TIMESTAMP`,
        [token]
      );

      if (tokenResult.rows.length === 0) {
        throw new HttpError(400, "Invalid or expired verification token");
      }

      const verificationToken = tokenResult.rows[0];

      // Mark token as used
      await query(
        `UPDATE email_verification_tokens 
         SET is_used = TRUE, used_at = CURRENT_TIMESTAMP, updateduser = $1 
         WHERE id = $2`,
        ["SYSTEM", verificationToken.id]
      );

      // Update user email_verified status
      await query(
        `UPDATE users 
         SET email_verified = TRUE, email_verified_at = CURRENT_TIMESTAMP 
         WHERE id = $1`,
        [verificationToken.user_id]
      );

      logger.success(`Email verified for user: ${verificationToken.user_id}`);

      res.json({
        success: true,
        message: "Email verified successfully. You can now use all features.",
        data: {
          emailVerified: true,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async resendVerificationEmail(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        throw new HttpError(400, "Email is required");
      }

      // Find user by email
      const userResult = await query(
        `SELECT * FROM users WHERE email = $1 AND ${getActiveRecordsFilter()}`,
        [email]
      );

      if (userResult.rows.length === 0) {
        throw new HttpError(404, "User not found");
      }

      const user: User = userResult.rows[0];

      // Check if already verified
      if (user.email_verified) {
        throw new HttpError(400, "Email is already verified");
      }

      // Delete any existing unused tokens
      await query(
        `UPDATE email_verification_tokens 
         SET isdeleted = TRUE, deleteddate = CURRENT_TIMESTAMP, deleteduser = 'SYSTEM'
         WHERE user_id = $1 AND is_used = FALSE`,
        [user.id]
      );

      // Generate new verification token
      const verificationToken = uuidv4();
      const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await query(
        `INSERT INTO email_verification_tokens (id, user_id, email, token, expires_at, createduser, updateduser)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          uuidv4(),
          user.id,
          user.email,
          verificationToken,
          verificationExpiresAt,
          "SYSTEM",
          "SYSTEM",
        ]
      );

      // Send verification email
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;

      await emailService.sendVerificationEmail(user.email, verificationUrl);

      logger.success(`Verification email resent to: ${user.email}`);

      res.json({
        success: true,
        message: "Verification email sent successfully. Please check your inbox.",
        data: {
          email: user.email,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userResult = await query(
        `SELECT u.*, s.currency, s.language, s.theme, s.default_category_expense, s.default_category_income
         FROM users u 
         LEFT JOIN settings s ON u.id = s.user_id 
         WHERE u.id = $1 AND u.isdeleted = FALSE`,
        [req.user!.id]
      );

      if (userResult.rows.length === 0) {
        throw new HttpError(404, "User not found");
      }

      const user = userResult.rows[0];

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            avatar: user.avatar,
            created_at: user.created_at,
          },
          settings: {
            id: user.id_1,
            userId: user.user_id,
            currency: user.currency,
            language: user.language,
            theme: user.theme,
            default_category_expense: user.default_category_expense,
            default_category_income: user.default_category_income,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadAvatar(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info(`Upload avatar attempt: User ID = ${req.user?.id}`);

      if (!req.file) {
        logger.error(`No file received for user ${req.user?.id}`);
        throw new HttpError(400, "No file provided");
      }

      logger.info(`File received: ${req.file.originalname}, size: ${req.file.size}`);

      // Read file and convert to buffer
      const filePath = req.file.path;
      const fileBuffer = fs.readFileSync(filePath);

      // Upload to Cloudinary
      const avatarUrl = await uploadImageToCloudinary(fileBuffer, req.file.originalname);

      // Delete temporary file
      fs.unlinkSync(filePath);

      const auditFields = getUpdateAuditFields(req);

      // Update user's avatar in database
      const result = await query(
        "UPDATE users SET avatar = $1, updateduser = $2 WHERE id = $3 RETURNING *",
        [avatarUrl, auditFields.updateduser, req.user!.id]
      );

      const updatedUser = result.rows[0];

      logger.success(
        `Avatar uploaded for user: ${updatedUser.email}, avatar: ${updatedUser.avatar}`
      );

      res.json({
        success: true,
        message: "Avatar uploaded successfully",
        data: {
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            full_name: updatedUser.full_name,
            avatar: updatedUser.avatar,
          },
        },
      });
    } catch (error) {
      logger.error(`Avatar upload error: ${(error as Error).message}`);
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { fullName, avatar } = req.body;
      const auditFields = getUpdateAuditFields(req);

      const result = await query(
        "UPDATE users SET full_name = COALESCE($1, full_name), avatar = COALESCE($2, avatar), updateduser = $3 WHERE id = $4 RETURNING *",
        [fullName || null, avatar || null, auditFields.updateduser, req.user!.id]
      );

      const updatedUser: User = result.rows[0];

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: {
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            full_name: updatedUser.full_name,
            avatar: updatedUser.avatar,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        throw new HttpError(400, "Current password and new password are required");
      }

      const userResult = await query(
        `SELECT * FROM users WHERE id = $1 AND ${getActiveRecordsFilter()}`,
        [req.user!.id]
      );

      if (userResult.rows.length === 0) {
        throw new HttpError(404, "User not found");
      }

      const user: User = userResult.rows[0];

      // Verify current password
      const isValidPassword = await comparePassword(currentPassword, user.password);

      if (!isValidPassword) {
        throw new HttpError(401, "Current password is incorrect");
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update password with audit fields
      const auditFields = getUpdateAuditFields(req);
      await query("UPDATE users SET password = $1, updateduser = $2 WHERE id = $3", [
        hashedPassword,
        auditFields.updateduser,
        req.user!.id,
      ]);

      logger.info(`Password changed for user: ${user.email}`);

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
export default authController;

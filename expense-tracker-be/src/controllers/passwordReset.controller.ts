import { query } from "@/db/client.js";
import { HttpError } from "@/middleware/errorHandler.js";
import { AuthRequest, User } from "@/types/index.js";
import { getActiveRecordsFilter, getUpdateAuditFields } from "@/utils/audit.js";
import { emailService } from "@/utils/email.js";
import { comparePassword, hashPassword } from "@/utils/hash.js";
import { logger } from "@/utils/logger.js";
import crypto from "crypto";
import { NextFunction, Response } from "express";

interface PasswordChangeRequest {
  id: string;
  user_id: string;
  otp: string;
  expires_at: Date;
  is_used: boolean;
  created_at: Date;
}

/**
 * Generate a 6-digit OTP
 */
function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export class PasswordResetController {
  /**
   * Step 1: Request password change - sends OTP to user's email
   */
  async requestPasswordChange(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { currentPassword } = req.body;

      if (!currentPassword) {
        throw new HttpError(400, "Current password is required");
      }

      // Get user
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

      // Generate OTP
      const otp = generateOTP();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Delete any existing unused OTPs for this user
      await query(
        `UPDATE password_change_otps 
         SET is_used = TRUE, updateduser = 'SYSTEM' 
         WHERE user_id = $1 AND is_used = FALSE`,
        [user.id]
      );

      // Store OTP in database
      const otpId = crypto.randomUUID();
      const auditFields = getUpdateAuditFields(req);

      await query(
        `INSERT INTO password_change_otps (id, user_id, otp, expires_at, createduser, updateduser)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [otpId, user.id, otp, otpExpiresAt, auditFields.updateduser, auditFields.updateduser]
      );

      // Send OTP email
      try {
        await emailService.sendEmail({
          to: user.email,
          subject: "[Expense Tracker] Mã OTP xác nhận đổi mật khẩu",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">🔐 Mã OTP Xác Nhận</h1>
              </div>
              <div style="padding: 30px; background-color: #f9fafb;">
                <p style="font-size: 16px; color: #374151;">Xin chào ${user.full_name || user.email},</p>
                <p style="font-size: 16px; color: #374151;">
                  Bạn vừa yêu cầu đổi mật khẩu tài khoản Expense Tracker. 
                  Sử dụng mã OTP dưới đây để xác nhận:
                </p>
                <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px dashed #10b981;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">Mã OTP của bạn:</p>
                  <p style="font-size: 32px; font-weight: bold; color: #10b981; letter-spacing: 8px; margin: 10px 0;">
                    ${otp}
                  </p>
                  <p style="font-size: 12px; color: #9ca3af;">
                    Có hiệu lực trong 10 phút
                  </p>
                </div>
                <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                  <p style="margin: 0; color: #92400e; font-size: 14px;">
                    ⚠️ <strong>Cảnh báo bảo mật:</strong> Không chia sẻ mã OTP này với bất kỳ ai, kể cả nhân viên hỗ trợ!
                  </p>
                </div>
                <p style="font-size: 14px; color: #6b7280;">
                  Nếu bạn không yêu cầu đổi mật khẩu, vui lòng:
                </p>
                <ul style="font-size: 14px; color: #6b7280;">
                  <li>Đổi mật khẩu ngay lập tức</li>
                  <li>Bỏ qua email này (OTP sẽ hết hạn sau 10 phút)</li>
                </ul>
              </div>
              <div style="padding: 20px; text-align: center; background-color: #f3f4f6; font-size: 12px; color: #9ca3af;">
                <p style="margin: 0;">Đây là email tự động, vui lòng không trả lời.</p>
                <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
              </div>
            </div>
          `,
        });
        logger.success(`OTP sent to: ${user.email}`);
      } catch (emailError) {
        logger.error("Failed to send OTP email", {
          email: user.email,
          error: (emailError as Error).message,
        });
        throw new HttpError(500, "Failed to send OTP email");
      }

      res.json({
        success: true,
        message: "OTP has been sent to your email address",
        data: {
          otpExpiresIn: 600, // 10 minutes in seconds
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Step 2: Verify OTP and change password
   */
  async verifyOTPAndChangePassword(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { otp, newPassword } = req.body;

      if (!otp || !newPassword) {
        throw new HttpError(400, "OTP and new password are required");
      }

      // Password strength validation
      if (newPassword.length < 8) {
        throw new HttpError(400, "New password must be at least 8 characters long");
      }

      // Check for password complexity
      const hasUppercase = /[A-Z]/.test(newPassword);
      const hasLowercase = /[a-z]/.test(newPassword);
      const hasNumber = /[0-9]/.test(newPassword);
      const hasSpecialChar = /[!@#$%^&*()_+\-={};':"\\|,.<>?/]/.test(newPassword);

      const strengthScore = [hasUppercase, hasLowercase, hasNumber, hasSpecialChar].filter(
        Boolean
      ).length;

      if (strengthScore < 3) {
        throw new HttpError(
          400,
          "New password must contain at least 3 of the following: uppercase letters, lowercase letters, numbers, special characters"
        );
      }

      // Find and verify OTP
      const otpResult = await query(
        `SELECT * FROM password_change_otps 
         WHERE user_id = $1 AND otp = $2 AND is_used = FALSE AND expires_at > CURRENT_TIMESTAMP`,
        [req.user!.id, otp]
      );

      if (otpResult.rows.length === 0) {
        throw new HttpError(400, "Invalid or expired OTP");
      }

      const passwordChangeOtp: PasswordChangeRequest = otpResult.rows[0];

      // Mark OTP as used
      const auditFields = getUpdateAuditFields(req);
      await query(
        `UPDATE password_change_otps 
         SET is_used = TRUE, used_at = CURRENT_TIMESTAMP, updateduser = $1 
         WHERE id = $2`,
        [auditFields.updateduser, passwordChangeOtp.id]
      );

      // Get user email for notification
      const userResult = await query(
        `SELECT * FROM users WHERE id = $1 AND ${getActiveRecordsFilter()}`,
        [req.user!.id]
      );

      if (userResult.rows.length === 0) {
        throw new HttpError(404, "User not found");
      }

      const user: User = userResult.rows[0];

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update password
      await query("UPDATE users SET password = $1, updateduser = $2 WHERE id = $3", [
        hashedPassword,
        auditFields.updateduser,
        req.user!.id,
      ]);

      logger.info(`Password changed for user: ${user.email} (with OTP verification)`);

      // Send confirmation email
      try {
        await emailService.sendEmail({
          to: user.email,
          subject: "[Expense Tracker] Mật khẩu của bạn đã được thay đổi thành công",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">✅ Đổi mật khẩu thành công</h1>
              </div>
              <div style="padding: 30px; background-color: #f9fafb;">
                <p style="font-size: 16px; color: #374151;">Xin chào ${user.full_name || user.email},</p>
                <p style="font-size: 16px; color: #374151;">
                  Mật khẩu tài khoản của bạn đã được thay đổi thành công vào lúc 
                  <strong>${new Date().toLocaleString("vi-VN")}</strong>.
                </p>
                <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">
                    🔒 Tài khoản của bạn đã được bảo mật với mật khẩu mới.
                  </p>
                </div>
                <p style="font-size: 14px; color: #6b7280;">
                  Để bảo mật tài khoản của bạn:
                </p>
                <ul style="font-size: 14px; color: #6b7280;">
                  <li>Không chia sẻ mật khẩu với người khác</li>
                  <li>Sử dụng mật khẩu mạnh với ít nhất 8 ký tự</li>
                  <li>Thường xuyên thay đổi mật khẩu</li>
                </ul>
                <div style="margin-top: 30px; text-align: center;">
                  <a href="http://localhost:5173" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                    Truy cập tài khoản của bạn
                  </a>
                </div>
              </div>
              <div style="padding: 20px; text-align: center; background-color: #f3f4f6; font-size: 12px; color: #9ca3af;">
                <p style="margin: 0;">Đây là email tự động, vui lòng không trả lời.</p>
                <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
              </div>
            </div>
          `,
        });
        logger.success(`Password change confirmation email sent to: ${user.email}`);
      } catch (emailError) {
        logger.error("Failed to send confirmation email", {
          email: user.email,
          error: (emailError as Error).message,
        });
      }

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const passwordResetController = new PasswordResetController();
export default passwordResetController;

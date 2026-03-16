import { logger } from "@/utils/logger.js";
import { google } from "googleapis";
import nodemailer from "nodemailer";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private from: string;
  private oauth2Client: any;
  private isOAuth2Configured: boolean = false;

  constructor() {
    this.from = process.env.EMAIL_FROM || "Expense Tracker <noreply@expense-tracker.com>";

    // Check if OAuth2 is configured
    if (
      process.env.GOOGLE_OAUTH_CLIENT_ID &&
      process.env.GOOGLE_OAUTH_CLIENT_SECRET &&
      process.env.GOOGLE_OAUTH_REFRESH_TOKEN &&
      process.env.EMAIL_USER
    ) {
      this.isOAuth2Configured = true;
      this.setupOAuth2();
    } else {
      // Fallback to SMTP
      this.setupSMTP();
    }
  }

  private setupOAuth2(): void {
    try {
      // Create OAuth2 client
      this.oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_OAUTH_CLIENT_ID,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
      );

      // Set refresh token
      this.oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
      });

      // Configure transporter with OAuth2
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.EMAIL_USER,
          clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
          clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
          accessToken: this.getAccessToken(),
        },
      } as any);

      logger.info("Email service configured with OAuth2");
    } catch (error) {
      logger.error("Failed to setup OAuth2 email service", {
        error: (error as Error).message,
      });
      this.setupSMTP();
    }
  }

  private setupSMTP(): void {
    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
        port: parseInt(process.env.EMAIL_PORT || "587"),
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      logger.info("Email service configured with SMTP");
    } catch (error) {
      logger.error("Failed to setup SMTP email service", {
        error: (error as Error).message,
      });
    }
  }

  private async getAccessToken(): Promise<string> {
    try {
      const accessTokenResponse = await this.oauth2Client.getAccessToken();
      return accessTokenResponse.token as string;
    } catch (error) {
      logger.error("Failed to get access token", {
        error: (error as Error).message,
      });
      throw error;
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (!this.transporter) {
        logger.error("Email transporter not configured");
        return false;
      }

      const mailOptions: nodemailer.SendMailOptions = {
        from: this.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      // If using OAuth2, refresh access token before sending
      if (this.isOAuth2Configured) {
        const accessToken = await this.getAccessToken();
        (this.transporter as any).options.auth.accessToken = accessToken;
      }

      const info = await this.transporter.sendMail(mailOptions);

      logger.success(`Email sent to ${options.to}: ${info.messageId}`);

      return true;
    } catch (error) {
      logger.error("Failed to send email", {
        to: options.to,
        subject: options.subject,
        error: (error as Error).message,
      });
      return false;
    }
  }

  /**
   * Send email verification email
   */
  async sendVerificationEmail(to: string, verificationUrl: string): Promise<boolean> {
    const subject = "Verify Your Email - Expense Tracker";
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .button:hover { background: #5a6fd6; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 Verify Your Email</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>Thank you for registering with Expense Tracker! To complete your registration, please verify your email address by clicking the button below:</p>
            <p style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
            <p>This verification link will expire in 24 hours.</p>
            <p>If you didn't create an account with us, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Hello,
      
      Thank you for registering with Expense Tracker!
      
      To complete your registration, please verify your email address by clicking the link below:
      
      ${verificationUrl}
      
      This verification link will expire in 24 hours.
      
      If you didn't create an account with us, please ignore this email.
      
      ---
      Expense Tracker Team
    `;

    return this.sendEmail({ to, subject, html, text });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(to: string, resetUrl: string): Promise<boolean> {
    const subject = "Reset Your Password - Expense Tracker";
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #f5576c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Reset Your Password</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset your password. Click the button below to reset it:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #f5576c;">${resetUrl}</p>
            <div class="warning">
              <strong>⚠️ Important:</strong> This link will expire in 1 hour.
            </div>
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Hello,
      
      We received a request to reset your password.
      
      Click the link below to reset your password:
      
      ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you didn't request a password reset, please ignore this email.
      
      ---
      Expense Tracker Team
    `;

    return this.sendEmail({ to, subject, html, text });
  }
}

export const emailService = new EmailService();
export default emailService;

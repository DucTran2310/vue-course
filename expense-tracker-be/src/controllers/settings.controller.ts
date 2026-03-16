import { query } from "@/db/client.js";
import { HttpError } from "@/middleware/errorHandler.js";
import { AuthRequest, Settings } from "@/types/index.js";
import { logger } from "@/utils/logger.js";
import { NextFunction, Response } from "express";

export class SettingsController {
  async getSettings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await query("SELECT * FROM settings WHERE user_id = $1", [req.user!.id]);

      if (result.rows.length === 0) {
        throw new HttpError(404, "Settings not found");
      }

      const settings: Settings = result.rows[0];

      res.json({
        success: true,
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSettings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { currency, language, theme, defaultCategoryExpense, defaultCategoryIncome } = req.body;

      const existingResult = await query("SELECT * FROM settings WHERE user_id = $1", [
        req.user!.id,
      ]);

      if (existingResult.rows.length === 0) {
        throw new HttpError(404, "Settings not found");
      }

      const result = await query(
        `UPDATE settings
         SET currency = COALESCE($1, currency),
             language = COALESCE($2, language),
             theme = COALESCE($3, theme),
             default_category_expense = COALESCE($4, default_category_expense),
             default_category_income = COALESCE($5, default_category_income)
         WHERE user_id = $6
         RETURNING *`,
        [
          currency || null,
          language || null,
          theme || null,
          defaultCategoryExpense ? parseInt(defaultCategoryExpense) : null,
          defaultCategoryIncome ? parseInt(defaultCategoryIncome) : null,
          req.user!.id,
        ]
      );

      const settings: Settings = result.rows[0];

      logger.info(`Settings updated for user: ${req.user!.id}`);

      res.json({
        success: true,
        message: "Settings updated successfully",
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const settingsController = new SettingsController();
export default settingsController;

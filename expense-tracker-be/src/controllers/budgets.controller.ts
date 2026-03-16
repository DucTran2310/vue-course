import { query } from "@/db/client.js";
import { HttpError } from "@/middleware/errorHandler.js";
import { AuthRequest, Budget } from "@/types/index.js";
import { logger } from "@/utils/logger.js";
import { NextFunction, Response } from "express";

export class BudgetsController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await query(
        `SELECT b.*, c.name as category_name, c.icon as category_icon, c.color as category_color
         FROM budgets b
         JOIN categories c ON b.category_id = c.id
         WHERE b.user_id = $1
         ORDER BY b.start_date DESC`,
        [req.user!.id]
      );

      const budgets: Budget[] = result.rows;

      res.json({
        success: true,
        data: budgets,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const result = await query(
        `SELECT b.*, c.name as category_name, c.icon as category_icon, c.color as category_color
         FROM budgets b
         JOIN categories c ON b.category_id = c.id
         WHERE b.id = $1 AND b.user_id = $2`,
        [id, req.user!.id]
      );

      if (result.rows.length === 0) {
        throw new HttpError(404, "Budget not found");
      }

      const budget: Budget = result.rows[0];

      res.json({
        success: true,
        data: budget,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { categoryId, amount, period, startDate, endDate } = req.body;

      if (!categoryId || !amount || !period || !startDate) {
        throw new HttpError(400, "CategoryId, amount, period, and startDate are required");
      }

      const result = await query(
        `INSERT INTO budgets (user_id, category_id, amount, period, start_date, end_date)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          req.user!.id,
          parseInt(categoryId),
          amount.toString(),
          period,
          new Date(startDate),
          endDate ? new Date(endDate) : null,
        ]
      );

      const budget: Budget = result.rows[0];

      logger.info(`Budget created: ${budget.id}`);

      res.status(201).json({
        success: true,
        message: "Budget created successfully",
        data: budget,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { categoryId, amount, period, startDate, endDate } = req.body;

      const existingResult = await query("SELECT * FROM budgets WHERE id = $1 AND user_id = $2", [
        id,
        req.user!.id,
      ]);

      if (existingResult.rows.length === 0) {
        throw new HttpError(404, "Budget not found");
      }

      const result = await query(
        `UPDATE budgets
         SET category_id = COALESCE($1, category_id),
             amount = COALESCE($2, amount),
             period = COALESCE($3, period),
             start_date = COALESCE($4, start_date),
             end_date = COALESCE($5, end_date)
         WHERE id = $6 AND user_id = $7
         RETURNING *`,
        [
          categoryId ? parseInt(categoryId) : null,
          amount ? amount.toString() : null,
          period || null,
          startDate ? new Date(startDate) : null,
          endDate ? new Date(endDate) : null,
          id,
          req.user!.id,
        ]
      );

      const budget: Budget = result.rows[0];

      logger.info(`Budget updated: ${budget.id}`);

      res.json({
        success: true,
        message: "Budget updated successfully",
        data: budget,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const existingResult = await query("SELECT * FROM budgets WHERE id = $1 AND user_id = $2", [
        id,
        req.user!.id,
      ]);

      if (existingResult.rows.length === 0) {
        throw new HttpError(404, "Budget not found");
      }

      await query("DELETE FROM budgets WHERE id = $1 AND user_id = $2", [id, req.user!.id]);

      logger.info(`Budget deleted: ${id}`);

      res.json({
        success: true,
        message: "Budget deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const budgetsController = new BudgetsController();
export default budgetsController;

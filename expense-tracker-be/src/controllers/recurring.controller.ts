import { query } from "@/db/client.js";
import { HttpError } from "@/middleware/errorHandler.js";
import { AuthRequest, RecurringTransaction } from "@/types/index.js";
import { logger } from "@/utils/logger.js";
import { NextFunction, Response } from "express";

export class RecurringController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await query(
        `SELECT r.*, c.name as category_name, c.icon as category_icon, c.color as category_color
         FROM recurring_transactions r
         JOIN categories c ON r.category_id = c.id
         WHERE r.user_id = $1
         ORDER BY r.next_due_date ASC`,
        [req.user!.id]
      );

      const recurring: RecurringTransaction[] = result.rows;

      res.json({
        success: true,
        data: recurring,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const result = await query(
        `SELECT r.*, c.name as category_name, c.icon as category_icon, c.color as category_color
         FROM recurring_transactions r
         JOIN categories c ON r.category_id = c.id
         WHERE r.id = $1 AND r.user_id = $2`,
        [id, req.user!.id]
      );

      if (result.rows.length === 0) {
        throw new HttpError(404, "Recurring transaction not found");
      }

      const recurring: RecurringTransaction = result.rows[0];

      res.json({
        success: true,
        data: recurring,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { categoryId, title, amount, type, recurrence, nextDueDate, isActive, notes } =
        req.body;

      if (!categoryId || !title || !amount || !type || !recurrence || !nextDueDate) {
        throw new HttpError(
          400,
          "CategoryId, title, amount, type, recurrence, and nextDueDate are required"
        );
      }

      const result = await query(
        `INSERT INTO recurring_transactions (user_id, category_id, title, amount, type, recurrence, next_due_date, is_active, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          req.user!.id,
          parseInt(categoryId),
          title,
          amount.toString(),
          type,
          recurrence,
          new Date(nextDueDate),
          isActive !== undefined ? isActive : true,
          notes || null,
        ]
      );

      const recurring: RecurringTransaction = result.rows[0];

      logger.info(`Recurring transaction created: ${recurring.id}`);

      res.status(201).json({
        success: true,
        message: "Recurring transaction created successfully",
        data: recurring,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { categoryId, title, amount, type, recurrence, nextDueDate, isActive, notes } =
        req.body;

      const existingResult = await query(
        "SELECT * FROM recurring_transactions WHERE id = $1 AND user_id = $2",
        [id, req.user!.id]
      );

      if (existingResult.rows.length === 0) {
        throw new HttpError(404, "Recurring transaction not found");
      }

      const result = await query(
        `UPDATE recurring_transactions
         SET category_id = COALESCE($1, category_id),
             title = COALESCE($2, title),
             amount = COALESCE($3, amount),
             type = COALESCE($4, type),
             recurrence = COALESCE($5, recurrence),
             next_due_date = COALESCE($6, next_due_date),
             is_active = COALESCE($7, is_active),
             notes = COALESCE($8, notes)
         WHERE id = $9 AND user_id = $10
         RETURNING *`,
        [
          categoryId ? parseInt(categoryId) : null,
          title || null,
          amount ? amount.toString() : null,
          type || null,
          recurrence || null,
          nextDueDate ? new Date(nextDueDate) : null,
          isActive !== undefined ? isActive : null,
          notes !== undefined ? notes : null,
          id,
          req.user!.id,
        ]
      );

      const recurring: RecurringTransaction = result.rows[0];

      logger.info(`Recurring transaction updated: ${recurring.id}`);

      res.json({
        success: true,
        message: "Recurring transaction updated successfully",
        data: recurring,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const existingResult = await query(
        "SELECT * FROM recurring_transactions WHERE id = $1 AND user_id = $2",
        [id, req.user!.id]
      );

      if (existingResult.rows.length === 0) {
        throw new HttpError(404, "Recurring transaction not found");
      }

      await query("DELETE FROM recurring_transactions WHERE id = $1 AND user_id = $2", [
        id,
        req.user!.id,
      ]);

      logger.info(`Recurring transaction deleted: ${id}`);

      res.json({
        success: true,
        message: "Recurring transaction deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const recurringController = new RecurringController();
export default recurringController;

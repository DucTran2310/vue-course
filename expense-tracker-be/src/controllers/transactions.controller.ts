import { query } from "@/db/client.js";
import { HttpError } from "@/middleware/errorHandler.js";
import { AuthRequest, Transaction } from "@/types/index.js";
import { logger } from "@/utils/logger.js";
import { NextFunction, Response } from "express";

export class TransactionsController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { startDate, endDate, type, categoryId, status } = req.query;

      let sql = `
        SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color, c.type as category_type
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE t.user_id = $1
      `;
      const params: any[] = [req.user!.id];
      let paramCount = 1;

      if (startDate && endDate) {
        paramCount++;
        sql += ` AND t.date >= $${paramCount}`;
        params.push(new Date(startDate as string));

        paramCount++;
        sql += ` AND t.date <= $${paramCount}`;
        params.push(new Date(endDate as string));
      }

      if (type) {
        paramCount++;
        sql += ` AND t.type = $${paramCount}`;
        params.push(type);
      }

      if (categoryId) {
        paramCount++;
        sql += ` AND t.category_id = $${paramCount}`;
        params.push(parseInt(categoryId as string));
      }

      if (status) {
        paramCount++;
        sql += ` AND t.status = $${paramCount}`;
        params.push(status);
      }

      sql += " ORDER BY t.date DESC, t.created_at DESC";

      const result = await query(sql, params);
      const transactions: Transaction[] = result.rows;

      res.json({
        success: true,
        data: transactions,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const result = await query(
        `SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color, c.type as category_type
         FROM transactions t
         JOIN categories c ON t.category_id = c.id
         WHERE t.id = $1 AND t.user_id = $2`,
        [id, req.user!.id]
      );

      if (result.rows.length === 0) {
        throw new HttpError(404, "Transaction not found");
      }

      const transaction: Transaction = result.rows[0];

      res.json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, amount, type, categoryId, date, status, notes } = req.body;

      if (!title || !amount || !type || !categoryId || !date) {
        throw new HttpError(400, "Title, amount, type, categoryId, and date are required");
      }

      const result = await query(
        `INSERT INTO transactions (user_id, category_id, title, amount, type, status, date, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          req.user!.id,
          parseInt(categoryId),
          title,
          amount.toString(),
          type,
          status || "completed",
          new Date(date),
          notes || null,
        ]
      );

      const transaction: Transaction = result.rows[0];

      logger.info(`Transaction created: ${transaction.id}`);

      res.status(201).json({
        success: true,
        message: "Transaction created successfully",
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { title, amount, categoryId, date, status, notes } = req.body;

      const existingResult = await query(
        "SELECT * FROM transactions WHERE id = $1 AND user_id = $2",
        [id, req.user!.id]
      );

      if (existingResult.rows.length === 0) {
        throw new HttpError(404, "Transaction not found");
      }

      const result = await query(
        `UPDATE transactions
         SET title = COALESCE($1, title),
             amount = COALESCE($2, amount),
             category_id = COALESCE($3, category_id),
             date = COALESCE($4, date),
             status = COALESCE($5, status),
             notes = COALESCE($6, notes)
         WHERE id = $7 AND user_id = $8
         RETURNING *`,
        [
          title || null,
          amount ? amount.toString() : null,
          categoryId ? parseInt(categoryId) : null,
          date ? new Date(date) : null,
          status || null,
          notes !== undefined ? notes : null,
          id,
          req.user!.id,
        ]
      );

      const transaction: Transaction = result.rows[0];

      logger.info(`Transaction updated: ${transaction.id}`);

      res.json({
        success: true,
        message: "Transaction updated successfully",
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const existingResult = await query(
        "SELECT * FROM transactions WHERE id = $1 AND user_id = $2",
        [id, req.user!.id]
      );

      if (existingResult.rows.length === 0) {
        throw new HttpError(404, "Transaction not found");
      }

      await query("DELETE FROM transactions WHERE id = $1 AND user_id = $2", [id, req.user!.id]);

      logger.info(`Transaction deleted: ${id}`);

      res.json({
        success: true,
        message: "Transaction deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getSummary(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        throw new HttpError(400, "startDate and endDate are required");
      }

      const incomeResult = await query(
        `SELECT COALESCE(SUM(amount), 0) as total
         FROM transactions
         WHERE user_id = $1 AND type = 'income' AND date >= $2 AND date <= $3`,
        [req.user!.id, new Date(startDate as string), new Date(endDate as string)]
      );

      const expenseResult = await query(
        `SELECT COALESCE(SUM(amount), 0) as total
         FROM transactions
         WHERE user_id = $1 AND type = 'expense' AND date >= $2 AND date <= $3`,
        [req.user!.id, new Date(startDate as string), new Date(endDate as string)]
      );

      const income = parseFloat(incomeResult.rows[0].total);
      const expense = parseFloat(expenseResult.rows[0].total);
      const balance = income - expense;

      res.json({
        success: true,
        data: { income, expense, balance },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const transactionsController = new TransactionsController();
export default transactionsController;

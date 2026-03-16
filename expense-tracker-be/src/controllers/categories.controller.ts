import { query } from "@/db/client.js";
import { HttpError } from "@/middleware/errorHandler.js";
import { AuthRequest, Category } from "@/types/index.js";
import { logger } from "@/utils/logger.js";
import { NextFunction, Response } from "express";

export class CategoriesController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type } = req.query;

      let sql = "SELECT * FROM categories";
      const params: any[] = [];

      if (type) {
        sql += " WHERE type = $1";
        params.push(type);
      }

      sql += " ORDER BY type, name";

      const result = await query(sql, params);
      const categories: Category[] = result.rows;

      res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const result = await query("SELECT * FROM categories WHERE id = $1", [id]);

      if (result.rows.length === 0) {
        throw new HttpError(404, "Category not found");
      }

      const category: Category = result.rows[0];

      res.json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, icon, color, type } = req.body;

      if (!name || !icon || !color || !type) {
        throw new HttpError(400, "Name, icon, color, and type are required");
      }

      if (!["expense", "income"].includes(type)) {
        throw new HttpError(400, "Type must be either 'expense' or 'income'");
      }

      const result = await query(
        "INSERT INTO categories (name, icon, color, type) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, icon, color, type]
      );

      const category: Category = result.rows[0];

      logger.info(`Category created: ${category.id}`);

      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { name, icon, color } = req.body;

      const existingResult = await query("SELECT * FROM categories WHERE id = $1", [id]);

      if (existingResult.rows.length === 0) {
        throw new HttpError(404, "Category not found");
      }

      const result = await query(
        "UPDATE categories SET name = COALESCE($1, name), icon = COALESCE($2, icon), color = COALESCE($3, color) WHERE id = $4 RETURNING *",
        [name || null, icon || null, color || null, id]
      );

      const category: Category = result.rows[0];

      logger.info(`Category updated: ${category.id}`);

      res.json({
        success: true,
        message: "Category updated successfully",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const existingResult = await query("SELECT * FROM categories WHERE id = $1", [id]);

      if (existingResult.rows.length === 0) {
        throw new HttpError(404, "Category not found");
      }

      await query("DELETE FROM categories WHERE id = $1", [id]);

      logger.info(`Category deleted: ${id}`);

      res.json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const categoriesController = new CategoriesController();
export default categoriesController;

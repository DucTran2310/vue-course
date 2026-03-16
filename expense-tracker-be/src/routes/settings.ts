import { settingsController } from "@/controllers/settings.controller.js";
import { authenticate } from "@/middleware/auth.js";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Get user settings
 *     description: Retrieve current user's settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Settings'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Settings not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", authenticate, (req, res, next) => settingsController.getSettings(req, res, next));

/**
 * @swagger
 * /settings:
 *   put:
 *     summary: Update user settings
 *     description: Update current user's settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currency:
 *                 type: string
 *                 description: Currency code
 *                 example: "VND"
 *               language:
 *                 type: string
 *                 description: Language code
 *                 example: "vi"
 *               theme:
 *                 type: string
 *                 enum: [light, dark]
 *                 example: "dark"
 *               defaultCategoryExpense:
 *                 type: integer
 *                 nullable: true
 *                 description: Default category ID for expenses
 *                 example: 1
 *               defaultCategoryIncome:
 *                 type: integer
 *                 nullable: true
 *                 description: Default category ID for income
 *                 example: 9
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Settings updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Settings'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/", authenticate, (req, res, next) =>
  settingsController.updateSettings(req, res, next)
);

export default router;

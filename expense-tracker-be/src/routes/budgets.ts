import { budgetsController } from "@/controllers/budgets.controller.js";
import { authenticate } from "@/middleware/auth.js";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /budgets:
 *   get:
 *     summary: Get all budgets
 *     description: Retrieve all budgets for the current user
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Budgets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Budget'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", authenticate, (req, res, next) => budgetsController.getAll(req, res, next));

/**
 * @swagger
 * /budgets/{id}:
 *   get:
 *     summary: Get budget by ID
 *     description: Retrieve a specific budget by its ID
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Budget ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Budget retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Budget'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Budget not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", authenticate, (req, res, next) => budgetsController.getById(req, res, next));

/**
 * @swagger
 * /budgets:
 *   post:
 *     summary: Create a new budget
 *     description: Create a new budget to track spending
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryId
 *               - amount
 *               - period
 *               - startDate
 *             properties:
 *               categoryId:
 *                 type: integer
 *                 description: Category ID to set budget for
 *                 example: 1
 *               amount:
 *                 type: number
 *                 description: Budget limit amount
 *                 example: 5000000
 *               period:
 *                 type: string
 *                 enum: [daily, weekly, monthly, yearly]
 *                 description: Budget period
 *                 example: "monthly"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Budget start date
 *                 example: "2024-01-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *                 description: Budget end date (optional)
 *                 example: null
 *     responses:
 *       201:
 *         description: Budget created successfully
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
 *                   example: "Budget created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Budget'
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
router.post("/", authenticate, (req, res, next) => budgetsController.create(req, res, next));

/**
 * @swagger
 * /budgets/{id}:
 *   put:
 *     summary: Update a budget
 *     description: Update an existing budget
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Budget ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: integer
 *                 example: 2
 *               amount:
 *                 type: number
 *                 example: 6000000
 *               period:
 *                 type: string
 *                 enum: [daily, weekly, monthly, yearly]
 *                 example: "monthly"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-02-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *                 example: null
 *     responses:
 *       200:
 *         description: Budget updated successfully
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
 *                   example: "Budget updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Budget'
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
 *       404:
 *         description: Budget not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", authenticate, (req, res, next) => budgetsController.update(req, res, next));

/**
 * @swagger
 * /budgets/{id}:
 *   delete:
 *     summary: Delete a budget
 *     description: Delete an existing budget
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Budget ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Budget deleted successfully
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
 *                   example: "Budget deleted successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Budget not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", authenticate, (req, res, next) => budgetsController.delete(req, res, next));

export default router;

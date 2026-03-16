import { recurringController } from "@/controllers/recurring.controller.js";
import { authenticate } from "@/middleware/auth.js";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /recurring:
 *   get:
 *     summary: Get all recurring transactions
 *     description: Retrieve all recurring transactions for the current user
 *     tags: [Recurring Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recurring transactions retrieved successfully
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
 *                     $ref: '#/components/schemas/RecurringTransaction'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", authenticate, (req, res, next) => recurringController.getAll(req, res, next));

/**
 * @swagger
 * /recurring/{id}:
 *   get:
 *     summary: Get recurring transaction by ID
 *     description: Retrieve a specific recurring transaction by its ID
 *     tags: [Recurring Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Recurring transaction ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Recurring transaction retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/RecurringTransaction'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Recurring transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", authenticate, (req, res, next) => recurringController.getById(req, res, next));

/**
 * @swagger
 * /recurring:
 *   post:
 *     summary: Create a new recurring transaction
 *     description: Create a new recurring transaction that will repeat at specified intervals
 *     tags: [Recurring Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - amount
 *               - type
 *               - categoryId
 *               - recurrence
 *               - nextDueDate
 *               - isActive
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Netflix Subscription"
 *               amount:
 *                 type: number
 *                 example: 250000
 *               type:
 *                 type: string
 *                 enum: [expense, income]
 *                 example: "expense"
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *               recurrence:
 *                 type: string
 *                 enum: [daily, weekly, monthly, yearly]
 *                 description: How often the transaction repeats
 *                 example: "monthly"
 *               nextDueDate:
 *                 type: string
 *                 format: date-time
 *                 description: Next date when the transaction should occur
 *                 example: "2024-02-01T00:00:00.000Z"
 *               isActive:
 *                 type: boolean
 *                 description: Whether the recurring transaction is active
 *                 example: true
 *               notes:
 *                 type: string
 *                 nullable: true
 *                 example: "Monthly entertainment subscription"
 *     responses:
 *       201:
 *         description: Recurring transaction created successfully
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
 *                   example: "Recurring transaction created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/RecurringTransaction'
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
router.post("/", authenticate, (req, res, next) => recurringController.create(req, res, next));

/**
 * @swagger
 * /recurring/{id}:
 *   put:
 *     summary: Update a recurring transaction
 *     description: Update an existing recurring transaction
 *     tags: [Recurring Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Recurring transaction ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Subscription"
 *               amount:
 *                 type: number
 *                 example: 300000
 *               categoryId:
 *                 type: integer
 *                 example: 2
 *               recurrence:
 *                 type: string
 *                 enum: [daily, weekly, monthly, yearly]
 *                 example: "monthly"
 *               nextDueDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-03-01T00:00:00.000Z"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               notes:
 *                 type: string
 *                 nullable: true
 *                 example: "Updated notes"
 *     responses:
 *       200:
 *         description: Recurring transaction updated successfully
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
 *                   example: "Recurring transaction updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/RecurringTransaction'
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
 *         description: Recurring transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", authenticate, (req, res, next) => recurringController.update(req, res, next));

/**
 * @swagger
 * /recurring/{id}:
 *   delete:
 *     summary: Delete a recurring transaction
 *     description: Delete an existing recurring transaction
 *     tags: [Recurring Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Recurring transaction ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Recurring transaction deleted successfully
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
 *                   example: "Recurring transaction deleted successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Recurring transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", authenticate, (req, res, next) => recurringController.delete(req, res, next));

export default router;

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
// @ts-ignore
import { swaggerSpec } from "@/config/swagger.js";
import { errorHandler, notFound } from "@/middleware/errorHandler.js";
import authRoutes from "@/routes/auth.js";
import budgetsRoutes from "@/routes/budgets.js";
import categoriesRoutes from "@/routes/categories.js";
import recurringRoutes from "@/routes/recurring.js";
import settingsRoutes from "@/routes/settings.js";
import transactionsRoutes from "@/routes/transactions.js";
import { logger } from "@/utils/logger.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || "v1";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: CORS_ORIGIN.split(","),
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for uploaded files
app.use(express.static("public"));

// Request logging
app.use(
  morgan("combined", {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API Documentation (Swagger)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/categories`, categoriesRoutes);
app.use(`/api/${API_VERSION}/transactions`, transactionsRoutes);
app.use(`/api/${API_VERSION}/budgets`, budgetsRoutes);
app.use(`/api/${API_VERSION}/recurring`, recurringRoutes);
app.use(`/api/${API_VERSION}/settings`, settingsRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Expense Tracker API",
    version: API_VERSION,
    endpoints: {
      health: "/health",
      api: `/api/${API_VERSION}`,
      auth: `/api/${API_VERSION}/auth`,
      categories: `/api/${API_VERSION}/categories`,
      transactions: `/api/${API_VERSION}/transactions`,
      budgets: `/api/${API_VERSION}/budgets`,
      recurring: `/api/${API_VERSION}/recurring`,
      settings: `/api/${API_VERSION}/settings`,
    },
    documentation: "/api-docs",
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
  logger.info(`API Version: ${API_VERSION}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
  logger.info(`API Documentation: http://localhost:${PORT}/api-docs`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received. Shutting down gracefully...");
  process.exit(0);
});

export default app;

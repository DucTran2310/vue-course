import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Expense Tracker API",
      version: "1.0.0",
      description: "API for managing personal finances, including transactions, categories, budgets, and more.",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            email: { type: "string", format: "email", example: "user@example.com" },
            fullName: { type: "string", example: "John Doe" },
            avatar: { type: "string", nullable: true, example: null },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Ăn uống" },
            icon: { type: "string", example: "🍽️" },
            color: { type: "string", example: "#FF6384" },
            type: { type: "string", enum: ["expense", "income"], example: "expense" },
          },
        },
        Transaction: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            userId: { type: "integer", example: 1 },
            categoryId: { type: "integer", example: 1 },
            title: { type: "string", example: "Lunch" },
            amount: { type: "string", example: "150000" },
            type: { type: "string", enum: ["expense", "income"], example: "expense" },
            date: { type: "string", format: "date-time" },
            notes: { type: "string", nullable: true },
          },
        },
        Budget: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            userId: { type: "integer", example: 1 },
            categoryId: { type: "integer", example: 1 },
            amount: { type: "string", example: "5000000" },
            spentAmount: { type: "string", example: "2000000" },
            period: { type: "string", enum: ["monthly", "weekly"], example: "monthly" },
            startDate: { type: "string", format: "date" },
            endDate: { type: "string", format: "date", nullable: true },
          },
        },
        RecurringTransaction: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            userId: { type: "integer", example: 1 },
            categoryId: { type: "integer", example: 1 },
            title: { type: "string", example: "Netflix Subscription" },
            amount: { type: "string", example: "250000" },
            type: { type: "string", enum: ["expense", "income"], example: "expense" },
            recurrence: {
              type: "string",
              enum: ["daily", "weekly", "monthly", "yearly"],
              example: "monthly",
            },
            nextDueDate: { type: "string", format: "date-time" },
            isActive: { type: "boolean", example: true },
            notes: { type: "string", nullable: true },
          },
        },
        Settings: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            userId: { type: "integer", example: 1 },
            currency: { type: "string", example: "VND" },
            language: { type: "string", example: "vi" },
            theme: { type: "string", example: "light" },
            defaultCategoryExpense: { type: "integer", nullable: true },
            defaultCategoryIncome: { type: "integer", nullable: true },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error message" },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operation successful" },
            data: { type: "object" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
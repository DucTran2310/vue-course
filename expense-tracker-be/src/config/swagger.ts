import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Expense Tracker API",
      version: "1.0.0",
      description:
        "API for managing personal finances, including transactions, categories, budgets, and more. Features Audit Trail & Soft Delete.",
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
        // ============================================
        // Audit Fields (mixin cho tất cả entities)
        // ============================================
        AuditFields: {
          type: "object",
          description: "Standard audit fields present in all entities for tracking changes",
          properties: {
            createduser: {
              type: "string",
              example: "user@example.com",
              description: "User who created this record",
            },
            createddate: {
              type: "string",
              format: "date-time",
              description: "Timestamp when record was created",
            },
            updateduser: {
              type: "string",
              nullable: true,
              example: "user@example.com",
              description: "User who last updated this record",
            },
            updateddate: {
              type: "string",
              format: "date-time",
              nullable: true,
              description: "Timestamp of last update",
            },
            isdeleted: {
              type: "boolean",
              example: false,
              description: "Soft delete flag (false = active, true = deleted)",
            },
            deleteduser: {
              type: "string",
              nullable: true,
              description: "User who deleted this record",
            },
            deleteddate: {
              type: "string",
              format: "date-time",
              nullable: true,
              description: "Timestamp when record was deleted",
            },
            deletednote: {
              type: "string",
              nullable: true,
              example: "User requested deletion",
              description: "Reason for deletion",
            },
            cdc_timestamp: {
              type: "string",
              format: "date-time",
              description: "CDC (Change Data Capture) timestamp",
            },
            cdc_version: {
              type: "integer",
              example: 1,
              description: "CDC version number - increments on each change",
            },
          },
        },
        // ============================================
        // User
        // ============================================
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid", example: "550e8400-e29b-41d4-a716-446655440000" },
            email: { type: "string", format: "email", example: "user@example.com" },
            fullName: { type: "string", example: "John Doe" },
            avatar: { type: "string", nullable: true, example: null },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            // Audit fields
            createduser: { type: "string", example: "SYSTEM" },
            createddate: { type: "string", format: "date-time" },
            updateduser: { type: "string", nullable: true },
            updateddate: { type: "string", format: "date-time", nullable: true },
            isdeleted: { type: "boolean", example: false },
            deleteduser: { type: "string", nullable: true },
            deleteddate: { type: "string", format: "date-time", nullable: true },
            deletednote: { type: "string", nullable: true },
            cdc_timestamp: { type: "string", format: "date-time" },
            cdc_version: { type: "integer", example: 1 },
          },
        },
        NewUser: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "user@example.com" },
            password: { type: "string", format: "password", example: "password123" },
            fullName: { type: "string", example: "John Doe" },
          },
        },
        UpdateUser: {
          type: "object",
          properties: {
            fullName: { type: "string", example: "Jane Doe" },
            avatar: { type: "string", nullable: true },
          },
        },
        // ============================================
        // Category
        // ============================================
        Category: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Ăn uống" },
            icon: { type: "string", example: "🍽️" },
            color: { type: "string", example: "#FF6384" },
            type: { type: "string", enum: ["expense", "income"], example: "expense" },
            createdAt: { type: "string", format: "date-time" },
            // Audit fields
            createduser: { type: "string", example: "SYSTEM" },
            createddate: { type: "string", format: "date-time" },
            updateduser: { type: "string", nullable: true },
            updateddate: { type: "string", format: "date-time", nullable: true },
            isdeleted: { type: "boolean", example: false },
            cdc_timestamp: { type: "string", format: "date-time" },
            cdc_version: { type: "integer", example: 1 },
          },
        },
        NewCategory: {
          type: "object",
          required: ["name", "icon", "color", "type"],
          properties: {
            name: { type: "string", example: "Mua sắm" },
            icon: { type: "string", example: "🛍️" },
            color: { type: "string", example: "#36A2EB" },
            type: { type: "string", enum: ["expense", "income"], example: "expense" },
          },
        },
        UpdateCategory: {
          type: "object",
          properties: {
            name: { type: "string", example: "Mua sắm cao cấp" },
            icon: { type: "string", example: "🛒" },
            color: { type: "string", example: "#9B59B6" },
          },
        },
        // ============================================
        // Transaction
        // ============================================
        Transaction: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            categoryId: { type: "integer", example: 1 },
            title: { type: "string", example: "Lunch" },
            amount: { type: "string", example: "150000" },
            type: { type: "string", enum: ["expense", "income"], example: "expense" },
            status: {
              type: "string",
              enum: ["completed", "pending", "cancelled"],
              example: "completed",
            },
            date: { type: "string", format: "date-time" },
            notes: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            // Audit fields
            createduser: { type: "string", example: "user@example.com" },
            createddate: { type: "string", format: "date-time" },
            updateduser: { type: "string", nullable: true },
            updateddate: { type: "string", format: "date-time", nullable: true },
            isdeleted: { type: "boolean", example: false },
            cdc_timestamp: { type: "string", format: "date-time" },
            cdc_version: { type: "integer", example: 1 },
          },
        },
        NewTransaction: {
          type: "object",
          required: ["categoryId", "title", "amount", "type", "date"],
          properties: {
            categoryId: { type: "integer", example: 1 },
            title: { type: "string", example: "Grocery shopping" },
            amount: { type: "string", example: "500000" },
            type: { type: "string", enum: ["expense", "income"], example: "expense" },
            status: {
              type: "string",
              enum: ["completed", "pending", "cancelled"],
              example: "completed",
            },
            date: { type: "string", format: "date" },
            notes: { type: "string", nullable: true, example: "Weekly groceries" },
          },
        },
        UpdateTransaction: {
          type: "object",
          properties: {
            categoryId: { type: "integer", example: 2 },
            title: { type: "string", example: "Updated title" },
            amount: { type: "string", example: "600000" },
            type: { type: "string", enum: ["expense", "income"] },
            status: {
              type: "string",
              enum: ["completed", "pending", "cancelled"],
            },
            date: { type: "string", format: "date" },
            notes: { type: "string", nullable: true },
          },
        },
        TransactionSummary: {
          type: "object",
          properties: {
            totalIncome: { type: "string", example: "10000000" },
            totalExpense: { type: "string", example: "7500000" },
            balance: { type: "string", example: "2500000" },
            byCategory: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  categoryId: { type: "integer" },
                  categoryName: { type: "string" },
                  totalAmount: { type: "string" },
                  type: { type: "string" },
                },
              },
            },
          },
        },
        // ============================================
        // Budget
        // ============================================
        Budget: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            categoryId: { type: "integer", example: 1 },
            amount: { type: "string", example: "5000000" },
            spentAmount: { type: "string", example: "2000000" },
            period: {
              type: "string",
              enum: ["daily", "weekly", "monthly"],
              example: "monthly",
            },
            startDate: { type: "string", format: "date" },
            endDate: { type: "string", format: "date", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            // Audit fields
            createduser: { type: "string", example: "user@example.com" },
            createddate: { type: "string", format: "date-time" },
            updateduser: { type: "string", nullable: true },
            updateddate: { type: "string", format: "date-time", nullable: true },
            isdeleted: { type: "boolean", example: false },
            cdc_timestamp: { type: "string", format: "date-time" },
            cdc_version: { type: "integer", example: 1 },
          },
        },
        NewBudget: {
          type: "object",
          required: ["categoryId", "amount", "period", "startDate"],
          properties: {
            categoryId: { type: "integer", example: 1 },
            amount: { type: "string", example: "5000000" },
            period: {
              type: "string",
              enum: ["daily", "weekly", "monthly"],
              example: "monthly",
            },
            startDate: { type: "string", format: "date" },
            endDate: { type: "string", format: "date", nullable: true },
          },
        },
        UpdateBudget: {
          type: "object",
          properties: {
            categoryId: { type: "integer" },
            amount: { type: "string" },
            period: { type: "string", enum: ["daily", "weekly", "monthly"] },
            startDate: { type: "string", format: "date" },
            endDate: { type: "string", format: "date", nullable: true },
          },
        },
        // ============================================
        // Recurring Transaction
        // ============================================
        RecurringTransaction: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            categoryId: { type: "integer", example: 1 },
            title: { type: "string", example: "Netflix Subscription" },
            amount: { type: "string", example: "250000" },
            type: { type: "string", enum: ["expense", "income"], example: "expense" },
            recurrence: {
              type: "string",
              enum: ["daily", "weekly", "monthly", "yearly"],
              example: "monthly",
            },
            nextDueDate: { type: "string", format: "date" },
            isActive: { type: "boolean", example: true },
            notes: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            // Audit fields
            createduser: { type: "string", example: "user@example.com" },
            createddate: { type: "string", format: "date-time" },
            updateduser: { type: "string", nullable: true },
            updateddate: { type: "string", format: "date-time", nullable: true },
            isdeleted: { type: "boolean", example: false },
            cdc_timestamp: { type: "string", format: "date-time" },
            cdc_version: { type: "integer", example: 1 },
          },
        },
        NewRecurringTransaction: {
          type: "object",
          required: ["categoryId", "title", "amount", "type", "recurrence", "nextDueDate"],
          properties: {
            categoryId: { type: "integer", example: 1 },
            title: { type: "string", example: "Netflix" },
            amount: { type: "string", example: "250000" },
            type: { type: "string", enum: ["expense", "income"] },
            recurrence: {
              type: "string",
              enum: ["daily", "weekly", "monthly", "yearly"],
            },
            nextDueDate: { type: "string", format: "date" },
            isActive: { type: "boolean", example: true },
            notes: { type: "string", nullable: true },
          },
        },
        UpdateRecurringTransaction: {
          type: "object",
          properties: {
            categoryId: { type: "integer" },
            title: { type: "string" },
            amount: { type: "string" },
            type: { type: "string", enum: ["expense", "income"] },
            recurrence: {
              type: "string",
              enum: ["daily", "weekly", "monthly", "yearly"],
            },
            nextDueDate: { type: "string", format: "date" },
            isActive: { type: "boolean" },
            notes: { type: "string", nullable: true },
          },
        },
        // ============================================
        // Settings
        // ============================================
        Settings: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            currency: { type: "string", example: "VND" },
            language: { type: "string", example: "vi" },
            theme: { type: "string", example: "light" },
            defaultCategoryExpense: { type: "integer", nullable: true },
            defaultCategoryIncome: { type: "integer", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            // Audit fields
            createduser: { type: "string", example: "SYSTEM" },
            createddate: { type: "string", format: "date-time" },
            updateduser: { type: "string", nullable: true },
            updateddate: { type: "string", format: "date-time", nullable: true },
            isdeleted: { type: "boolean", example: false },
            cdc_timestamp: { type: "string", format: "date-time" },
            cdc_version: { type: "integer", example: 1 },
          },
        },
        NewSettings: {
          type: "object",
          properties: {
            currency: { type: "string", example: "USD" },
            language: { type: "string", example: "en" },
            theme: { type: "string", example: "dark" },
            defaultCategoryExpense: { type: "integer", nullable: true },
            defaultCategoryIncome: { type: "integer", nullable: true },
          },
        },
        UpdateSettings: {
          type: "object",
          properties: {
            currency: { type: "string", example: "USD" },
            language: { type: "string", example: "en" },
            theme: { type: "string", example: "dark" },
            defaultCategoryExpense: { type: "integer", nullable: true },
            defaultCategoryIncome: { type: "integer", nullable: true },
          },
        },
        // ============================================
        // Auth Responses
        // ============================================
        AuthResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Login successful" },
            data: {
              type: "object",
              properties: {
                user: {
                  type: "object",
                  properties: {
                    id: { type: "string", format: "uuid" },
                    email: { type: "string", format: "email" },
                    fullName: { type: "string" },
                  },
                },
                token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
              },
            },
          },
        },
        // ============================================
        // Common Responses
        // ============================================
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error message" },
            error: {
              type: "object",
              properties: {
                code: { type: "string" },
                details: { type: "object" },
              },
            },
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
        PaginatedResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
            data: { type: "array", items: { type: "object" } },
            pagination: {
              type: "object",
              properties: {
                page: { type: "integer", example: 1 },
                limit: { type: "integer", example: 10 },
                total: { type: "integer", example: 100 },
                totalPages: { type: "integer", example: 10 },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);

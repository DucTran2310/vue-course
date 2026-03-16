# Expense Tracker Backend API

Backend API cho ứng dụng Expense Tracker - được xây dựng với Node.js, TypeScript, PostgreSQL, và **SQL Thuần (Raw SQL)**.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Development](#development)

## Features

### Đã triển khai (Implemented Features)

#### 1. **Authentication & Authorization**

- ✅ User Registration (với Email Verification)
- ✅ User Login (JWT Authentication)
- ✅ Get User Profile
- ✅ Update User Profile
- ✅ Change Password
- ✅ Protected Routes Middleware
- ✅ Password Hashing (bcryptjs)
- ✅ **Email Verification** (xác thực email qua link)
- ✅ **Resend Verification Email** (gửi lại email xác thực)

#### 2. **Categories Management**

- ✅ Get All Categories (filter by type: income/expense)
- ✅ Get Category by ID
- ✅ Create Custom Category
- ✅ Update Category
- ✅ Delete Category
- ✅ Default Categories seeding on user registration

Default Categories:

- **Expense**: Ăn uống, Mua sắm, Di chuyển, Giải trí, Hóa đơn, Y tế, Học tập, Khác
- **Income**: Lương, Thưởng, Đầu tư, Kinh doanh, Khác

#### 3. **Transactions Management**

- ✅ Get All Transactions (with filters)
- ✅ Get Transaction by ID
- ✅ Create Transaction
- ✅ Update Transaction
- ✅ Delete Transaction
- ✅ Get Transactions Summary
- ✅ Filter by date range, type, category, status

#### 4. **Budgets Management**

- ✅ Get All Budgets
- ✅ Get Budget by ID
- ✅ Create Budget (with spent amount tracking)
- ✅ Update Budget
- ✅ Delete Budget
- ✅ Budget periods: daily, weekly, monthly

#### 5. **Recurring Transactions**

- ✅ Get All Recurring Transactions
- ✅ Get Recurring Transaction by ID
- ✅ Create Recurring Transaction
- ✅ Update Recurring Transaction
- ✅ Delete Recurring Transaction
- ✅ Recurrence types: daily, weekly, monthly, yearly
- ✅ Active/Inactive toggle

#### 6. **Settings Management**

- ✅ Get User Settings
- ✅ Update User Settings
- ✅ Currency configuration
- ✅ Language configuration
- ✅ Theme configuration
- ✅ Default categories for income/expense

### Quy trình Backend (Flow)

#### 📧 User Registration Flow với Email Verification

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           USER REGISTRATION FLOW                                 │
│                         (Với Email Verification)                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Client     │
│  (Frontend)  │
└──────┬───────┘
       │
       │ POST /api/v1/auth/register
       │ Body: { email, password, fullName }
       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  1. Validate Input                                                               │
│     - Check email format (regex)                                                │
│     - Check password length (>= 6 chars)                                        │
│     - Check required fields                                                     │
└─────────────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  2. Check if User Exists                                                        │
│     - Query: SELECT * FROM users WHERE email = ? AND isdeleted = FALSE          │
│     - If exists → Return 409 Conflict                                           │
└─────────────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  3. Hash Password                                                               │
│     - bcrypt.hash(password, 10)                                                 │
│     - Lưu hashed password vào DB                                                │
└─────────────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  4. Create User Record                                                          │
│     - INSERT INTO users (email, password, full_name, ...) VALUES (...)          │
│     - Include audit fields (createduser, updateduser)                           │
│     - RETURNING * → Get created user                                            │
└─────────────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  5. Create Default Settings                                                     │
│     - INSERT INTO settings (user_id, currency, language, theme)                 │
│     - Default: currency='VND', language='vi', theme='light'                     │
└─────────────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  6. Seed Default Categories                                                     │
│     - Expense: Ăn uống, Mua sắm, Di chuyển, Giải trí, Hóa đơn, Y tế, Học tập   │
│     - Income: Lương, Thưởng, Đầu tư, Kinh doanh                                 │
│     - INSERT INTO categories (...) VALUES (...)                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  7. Generate Email Verification Token                                           │
│     - Create UUID: crypto.randomUUID() or uuidv4()                              │
│     - Set expiry: 24 hours from now                                             │
│     - INSERT INTO email_verification_tokens                                     │
│         (user_id, email, token, expires_at, ...)                                │
└─────────────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  8. Send Verification Email                                                     │
│     - Generate verification URL:                                                │
│       http://localhost:5173/verify-email?token=<token>                          │
│     - Create HTML email template với button                                     │
│     - Send via Nodemailer (SMTP Gmail)                                          │
│     - ✅ Success: Log "Verification email sent"                                 │
│     - ❌ Fail: Log error, continue registration                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  9. Generate JWT Token                                                          │
│     - jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '7d' })                  │
│     - Token includes user ID and email                                          │
└─────────────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────┐
│   Response   │
│  201 Created │
│  {                                                                           │
│    "success": true,                                                          │
│    "message": "User registered successfully. Please check your email...",    │
│    "data": {                                                                 │
│      "user": { id, email, fullName, emailVerified: false },                  │
│      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."                      │
│    }                                                                         │
│  }                                                                           │
└──────────────┘
```

#### 🔐 Email Verification Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         EMAIL VERIFICATION FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   User       │
│  (Email)     │
└──────┬───────┘
       │
       │ 1. User receives email
       │    "Verify Your Email - Expense Tracker"
       │    [ Verify Email Address ] ← Button
       │    Link: http://localhost:5173/verify-email?token=abc123...
       ▼
┌──────────────┐
│   Frontend   │
│  (Vue.js)    │
└──────┬───────┘
       │
       │ 2. User clicks button/link
       │    Frontend extracts token from URL
       │
       │ 3. Call API
       │    POST /api/v1/auth/verify-email
       │    Body: { token: "abc123..." }
       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  Backend: Verify Email Endpoint                                                  │
│                                                                                  │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ 1. Validate Token                                                         │  │
│  │    - Check token exists in request body                                   │  │
│  │    - Return 400 if missing                                                │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│         │                                                                       │
│         ▼                                                                       │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ 2. Query Database for Token                                               │  │
│  │    SELECT * FROM email_verification_tokens                                │  │
│  │    WHERE token = ? AND is_used = FALSE AND expires_at > NOW()             │  │
│  │                                                                           │  │
│  │    - Not found → 400 "Invalid or expired token"                           │  │
│  │    - Found → Continue                                                     │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│         │                                                                       │
│         ▼                                                                       │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ 3. Mark Token as Used                                                     │  │
│  │    UPDATE email_verification_tokens                                       │  │
│  │    SET is_used = TRUE, used_at = NOW(), updateduser = 'SYSTEM'            │  │
│  │    WHERE id = ?                                                           │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│         │                                                                       │
│         ▼                                                                       │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ 4. Update User Email Verified Status                                      │  │
│  │    UPDATE users                                                           │  │
│  │    SET email_verified = TRUE, email_verified_at = NOW()                   │  │
│  │    WHERE id = ?                                                           │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│         │                                                                       │
│         ▼                                                                       │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ 5. Log Success                                                            │  │
│  │    logger.success("Email verified for user: {user_id}")                   │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│         │                                                                       │
│         ▼                                                                       │
└─────────────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────┐
│   Response   │
│  200 OK      │
│  {                                                                           │
│    "success": true,                                                          │
│    "message": "Email verified successfully. You can now use all features.",  │
│    "data": { emailVerified: true }                                           │
│  }                                                                           │
└──────────────┘
```

#### 📤 Resend Verification Email Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      RESEND VERIFICATION EMAIL FLOW                              │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Client     │
│  (Frontend)  │
└──────┬───────┘
       │
       │ POST /api/v1/auth/resend-verification
       │ Body: { email: "user@example.com" }
       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  1. Validate Email                                                              │
│     - Check email exists in request body                                        │
│     - Return 400 if missing                                                     │
└─────────────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  2. Find User by Email                                                          │
│     - SELECT * FROM users WHERE email = ? AND isdeleted = FALSE                 │
│     - Not found → 404 "User not found"                                          │
└─────────────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  3. Check if Already Verified                                                   │
│     - If user.email_verified = TRUE                                             │
│     - Return 400 "Email is already verified"                                    │
└─────────────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  4. Invalidate Old Tokens                                                       │
│     - UPDATE email_verification_tokens                                          │
│     - SET isdeleted = TRUE, deleteddate = NOW(), deleteduser = 'SYSTEM'         │
│     - WHERE user_id = ? AND is_used = FALSE                                     │
└─────────────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  5. Generate New Token                                                          │
│     - Create new UUID                                                           │
│     - Set expiry: 24 hours                                                      │
│     - INSERT INTO email_verification_tokens (...)                               │
└─────────────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  6. Send New Verification Email                                                 │
│     - Generate new verification URL                                             │
│     - Send via Nodemailer                                                       │
│     - Log success                                                               │
└─────────────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────┐
│   Response   │
│  200 OK      │
│  {                                                                           │
│    "success": true,                                                          │
│    "message": "Verification email sent successfully. Please check your inbox.",│
│    "data": { email: "user@example.com" }                                     │
│  }                                                                           │
└──────────────┘
```

#### 📊 Database Schema for Email Verification

```sql
-- Bảng lưu verification tokens
CREATE TABLE email_verification_tokens (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,           -- 24 hours from creation
  is_used BOOLEAN DEFAULT FALSE,           -- Flag đã sử dụng chưa
  used_at TIMESTAMP,                       -- Thời điểm sử dụng
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createduser VARCHAR(255) DEFAULT 'SYSTEM',
  updateduser VARCHAR(255),
  isdeleted BOOLEAN DEFAULT FALSE,
  deleteduser VARCHAR(255),
  deleteddate TIMESTAMP,
  deletednote VARCHAR(255),
  cdc_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  cdc_version INTEGER DEFAULT 1,
  
  CONSTRAINT fk_email_verification_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes cho performance
CREATE INDEX idx_email_verification_token ON email_verification_tokens(token);
CREATE INDEX idx_email_verification_user_id ON email_verification_tokens(user_id);
CREATE INDEX idx_email_verification_email ON email_verification_tokens(email);
CREATE INDEX idx_email_verification_expires_at ON email_verification_tokens(expires_at);

-- Thêm cột vào users table
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN email_verified_at TIMESTAMP;
```

#### 📧 Email Template Example

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      color: white; padding: 30px; text-align: center; 
      border-radius: 10px 10px 0 0; 
    }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { 
      display: inline-block; 
      background: #667eea; 
      color: white; 
      padding: 15px 30px; 
      text-decoration: none; 
      border-radius: 5px; 
      font-weight: bold; 
      margin: 20px 0; 
    }
    .button:hover { background: #5a6fd6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📧 Verify Your Email</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Thank you for registering with Expense Tracker!</p>
      <p>To complete your registration, please verify your email address:</p>
      <p style="text-align: center;">
        <a href="http://localhost:5173/verify-email?token=abc123..." class="button">
          Verify Email Address
        </a>
      </p>
      <p>This verification link will expire in 24 hours.</p>
    </div>
  </div>
</body>
</html>
```

#### 🔧 Environment Configuration

```env
# .env file

# Frontend URL (cho email verification links)
FRONTEND_URL=http://localhost:5173

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # App Password từ Google
EMAIL_FROM=noreply@expense-tracker.com

# Logging
LOG_LEVEL=debug
```

#### 📋 API Endpoints Summary

| Method | Endpoint | Description | Body | Response |
|--------|----------|-------------|------|----------|
| POST | `/auth/register` | Đăng ký user mới | `{ email, password, fullName }` | `{ user, token, message }` |
| POST | `/auth/verify-email` | Xác thực email | `{ token }` | `{ emailVerified: true }` |
| POST | `/auth/resend-verification` | Gửi lại email | `{ email }` | `{ email }` |

#### Create Transaction Flow

```
Client → POST /api/v1/transactions (with JWT header)
  1. Verify JWT token
  2. Extract user info
  3. Validate transaction data
  4. Execute INSERT SQL query
  5. Return created transaction
  → Client
```

#### Get Transactions Flow

```
Client → GET /api/v1/transactions?startDate=&endDate=&type=expense (with JWT)
  1. Verify JWT token
  2. Extract user ID
  3. Execute SELECT query with JOIN with categories
  4. Apply filters (date, type, category, status)
  5. Return filtered list
  → Client
```

## Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 16
- **Database Client**: **node-postgres (pg)** - **Raw SQL**
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Security**: Helmet, CORS
- **Logging**: Morgan + Custom Logger
- **Docker**: Docker & Docker Compose
- **Code Quality**: ESLint, Prettier

**Note**: Dự án sử dụng **SQL thuần (Raw SQL)** thông qua `node-postgres` thay vì ORM như Drizzle hoặc Prisma. Điều này giúp:

- Hiệu suất tốt hơn
- Kiểm soát hoàn toàn câu SQL
- Không học thêm cú pháp ORM
- Dễ dàng debug và optimization

## Project Structure

```
expense-tracker-be/
├── src/
│   ├── controllers/      # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── categories.controller.ts
│   │   ├── transactions.controller.ts
│   │   ├── budgets.controller.ts
│   │   ├── recurring.controller.ts
│   │   └── settings.controller.ts
│   ├── db/              # Database configuration
│   │   ├── client.ts    # PostgreSQL client (pg)
│   │   └── schema.sql   # Database schema (SQL)
│   ├── middleware/      # Express middleware
│   │   ├── auth.ts      # Authentication middleware
│   │   └── errorHandler.ts
│   ├── routes/          # API routes
│   │   ├── auth.ts
│   │   ├── categories.ts
│   │   ├── transactions.ts
│   │   ├── budgets.ts
│   │   ├── recurring.ts
│   │   └── settings.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   ├── hash.ts      # Password hashing
│   │   └── logger.ts    # Logging utility
│   └── index.ts         # Application entry point
├── dist/                # Compiled JavaScript (generated)
├── logs/                # Application logs
├── .env                 # Environment variables (not in git)
├── .env.example         # Environment variables template
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── docker-compose.yml   # Docker services
├── Dockerfile           # Docker image
├── package.json
├── tsconfig.json
└── README.md
```

## Prerequisites

- Node.js 20 or higher
- npm or yarn
- PostgreSQL 16 (cài đặt riêng hoặc dùng Docker)
- Docker và Docker Compose (nếu dùng Docker)
- Git

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/expense-tracker-be.git
cd expense-tracker-be
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` và cập nhật:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=expense_tracker
DB_PASSWORD=your_password
DB_NAME=expense_tracker_db
DATABASE_URL=postgresql://expense_tracker:your_password@localhost:5432/expense_tracker_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:5175

# Logging
LOG_LEVEL=debug
```

## Running the Application

### Using Docker (Recommended)

1. Build và start tất cả services:

```bash
docker-compose up -d
```

1. Kiểm tra status:

```bash
docker-compose ps
```

1. Xem logs:

```bash
docker-compose logs -f api
```

1. Stop services:

```bash
docker-compose down
```

### Without Docker

#### Step 1: Setup Database

Tạo database trong PostgreSQL:

```bash
# Login vào PostgreSQL
psql -U postgres

# Tạo database
CREATE DATABASE expense_tracker_db;
CREATE USER expense_tracker WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE expense_tracker_db TO expense_tracker;
\q
```

#### Step 2: Run Schema

Import schema vào database:

```bash
psql -U expense_tracker -d expense_tracker_db -f src/db/schema.sql
```

Hoặc dùng database client như pgAdmin, DBeaver để chạy file `src/db/schema.sql`.

#### Development Mode

```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:3000`

#### Production Mode

1. Build project:

```bash
npm run build
```

1. Start server:

```bash
npm start
```

## Database Setup

### Schema File

File `src/db/schema.sql` chứa toàn bộ database schema:

- Tables: users, settings, categories, transactions, budgets, recurring_transactions
- Indexes cho performance
- Triggers cho auto update `updated_at`
- Constraints và relationships

### Manual Setup

Nếu cần reset database:

```bash
# Drop và tạo lại
dropdb -U postgres expense_tracker_db
createdb -U postgres expense_tracker_db

# Run schema lại
psql -U postgres -d expense_tracker_db -f src/db/schema.sql
```

## API Documentation

### Swagger UI (Interactive API Documentation)

Dự án đã tích hợp **Swagger UI** để cung cấp tài liệu API tương tác trực quan.

#### Truy cập Swagger UI

Sau khi khởi động server, truy cập:

```
http://localhost:3000/api-docs
```

![Swagger UI](./swagger-ui-example.png)

#### Các tính năng của Swagger UI

1. **Xem danh sách tất cả APIs** - Được nhóm theo chức năng (Authentication, Categories, Transactions, Budgets, Recurring, Settings)

2. **Try it out** - Test API trực tiếp từ trình duyệt:
   - Click vào endpoint muốn test
   - Click "Try it out"
   - Điền thông số (parameters, request body)
   - Click "Execute"
   - Xem response và status code

3. **Authentication với JWT**:
   - Click nút "Authorize" ở góc phải trên cùng
   - Nhập JWT token: `Bearer <your-jwt-token>`
   - Click "Authorize"
   - Tất cả requests sau sẽ tự động include token

4. **Xem schema chi tiết** - Click vào các model để xem cấu trúc dữ liệu

#### Flow sử dụng Swagger để test API

```
┌─────────────────────────────────────────────────────────────┐
│  Step 1: Login để lấy JWT Token                             │
│  - Mở POST /api/v1/auth/login                               │
│  - Click "Try it out"                                       │
│  - Điền email & password                                    │
│  - Click "Execute"                                          │
│  - Copy token từ response                                   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 2: Authorize với JWT Token                            │
│  - Click "Authorize" (nút màu xanh)                         │
│  - Dán token: Bearer <your-token>                           │
│  - Click "Authorize"                                        │
│  - Click "Close"                                            │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 3: Test các APIs khác                                 │
│  - Mở endpoint muốn test (ví dụ: GET /categories)           │
│  - Click "Try it out"                                       │
│  - Click "Execute" (token đã được tự động gửi)              │
│  - Xem kết quả response                                     │
└─────────────────────────────────────────────────────────────┘
```

#### Hướng dẫn viết Swagger Documentation cho API mới

Khi thêm API mới, thêm JSDoc comments theo format sau:

```typescript
/**
 * @swagger
 * /api/v1/your-endpoint:
 *   get:
 *     summary: Brief description of the endpoint
 *     description: Optional longer description
 *     tags: [YourTagName]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path/query/header
 *         name: parameterName
 *         required: true/false
 *         schema:
 *           type: string/integer/boolean
 *         description: What this parameter does
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - field1
 *               - field2
 *             properties:
 *               field1:
 *                 type: string
 *                 example: "example value"
 *               field2:
 *                 type: integer
 *                 example: 123
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/YourModel'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */
router.get("/your-endpoint", controllerHandler);
```

#### Tham khảo các Model/Schema đã định nghĩa

Trong file `src/config/swagger.ts`, các models sau đã được định nghĩa:

| Model | Description |
|-------|-------------|
| `User` | User account information |
| `Category` | Transaction category |
| `Transaction` | Financial transaction record |
| `Budget` | Budget limit and tracking |
| `RecurringTransaction` | Periodic/recurring transaction |
| `Settings` | User preferences |
| `Error` | Error response format |
| `SuccessResponse` | Success response format |

### Base URL (Traditional Documentation)

```
http://localhost:3000/api/v1
```

### Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| **Authentication** | | | |
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/profile` | Get user profile | Yes |
| PUT | `/auth/profile` | Update user profile | Yes |
| PUT | `/auth/change-password` | Change password | Yes |
| **Categories** | | | |
| GET | `/categories` | Get all categories | Yes |
| GET | `/categories/:id` | Get category by ID | Yes |
| POST | `/categories` | Create category | Yes |
| PUT | `/categories/:id` | Update category | Yes |
| DELETE | `/categories/:id` | Delete category | Yes |
| **Transactions** | | | |
| GET | `/transactions` | Get all transactions | Yes |
| GET | `/transactions/summary` | Get transactions summary | Yes |
| GET | `/transactions/:id` | Get transaction by ID | Yes |
| POST | `/transactions` | Create transaction | Yes |
| PUT | `/transactions/:id` | Update transaction | Yes |
| DELETE | `/transactions/:id` | Delete transaction | Yes |
| **Budgets** | | | |
| GET | `/budgets` | Get all budgets | Yes |
| GET | `/budgets/:id` | Get budget by ID | Yes |
| POST | `/budgets` | Create budget | Yes |
| PUT | `/budgets/:id` | Update budget | Yes |
| DELETE | `/budgets/:id` | Delete budget | Yes |
| **Recurring** | | | |
| GET | `/recurring` | Get all recurring transactions | Yes |
| GET | `/recurring/:id` | Get recurring transaction by ID | Yes |
| POST | `/recurring` | Create recurring transaction | Yes |
| PUT | `/recurring/:id` | Update recurring transaction | Yes |
| DELETE | `/recurring/:id` | Delete recurring transaction | Yes |
| **Settings** | | | |
| GET | `/settings` | Get user settings | Yes |
| PUT | `/settings` | Update user settings | Yes |

### Authentication

Tất cả protected endpoints cần Bearer token trong `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

### Example Requests

#### Register

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe"
  }'
```

#### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Create Transaction

```bash
curl -X POST http://localhost:3000/api/v1/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "title": "Grocery Shopping",
    "amount": 150.00,
    "type": "expense",
    "categoryId": 1,
    "date": "2024-01-15",
    "status": "completed",
    "notes": "Weekly groceries"
  }'
```

#### Get Transactions with Filters

```bash
curl -X GET "http://localhost:3000/api/v1/transactions?startDate=2024-01-01&endDate=2024-01-31&type=expense" \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Database Schema

### Tables

1. **users** - User accounts
2. **categories** - Transaction categories (global, không theo user)
3. **transactions** - Financial transactions
4. **budgets** - Budget limits và tracking
5. **recurring_transactions** - Recurring/periodic transactions
6. **settings** - User preferences và settings

### Schema Relationships

```
users (1) ----< (N) transactions
users (1) ----< (N) budgets
users (1) ----< (N) recurring_transactions
users (1) ----< (1) settings

categories (1) ----< (N) transactions
categories (1) ----< (N) budgets
categories (1) ----< (N) recurring_transactions
```

### Key Database Features

- **UUID**: User IDs, transaction IDs, budget IDs, recurring IDs dùng UUID
- **Indexes**: Optimized queries cho common filters
- **Triggers**: Auto update `updated_at`, audit fields, and CDC fields
- **Constraints**: Foreign keys, CHECK constraints, NOT NULL
- **Timestamps**: All tables có `created_at` và `updated_at`
- **Soft Delete**: Records không bị xóa thật, dùng flag `isdeleted` để mark deleted
- **Audit Trail**: Tất cả operations được track qua audit fields

## Audit Fields & Soft Delete

Dự án sử dụng **Audit Fields** và **Soft Delete** để track mọi thay đổi dữ liệu và maintain lịch sử records.

### Audit Fields (Tất cả Tables)

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `createduser` | VARCHAR(20) | User tạo record | `user@example.com` hoặc `SYSTEM` |
| `createddate` | TIMESTAMP | Thời điểm tạo | `2024-01-15 10:30:00` |
| `updateduser` | VARCHAR(20) | User cập nhật cuối | `user@example.com` (nullable) |
| `updateddate` | TIMESTAMP | Thời điểm cập nhật cuối | `2024-01-16 14:20:00` (nullable) |
| `isdeleted` | BOOLEAN | Soft delete flag | `FALSE` (active) / `TRUE` (deleted) |
| `deleteduser` | VARCHAR(20) | User xóa record | `admin@example.com` (nullable) |
| `deleteddate` | TIMESTAMP | Thời điểm xóa | `2024-01-20 09:15:00` (nullable) |
| `deletednote` | VARCHAR(500) | Lý do xóa | `"User requested deletion"` (nullable) |
| `cdc_timestamp` | TIMESTAMP | CDC timestamp cho tracking changes | `2024-01-16 14:20:00` |
| `cdc_version` | INTEGER | Version number (tự tăng mỗi khi update) | `1, 2, 3, ...` |

### Soft Delete Behavior

- **Hard DELETE** -> **Soft DELETE**: Tất cả DELETE operations được convert thành UPDATE sets `isdeleted = TRUE`
- **Active Records**: Chỉ records với `isdeleted = FALSE` được trả về trong API responses
- **Recovery**: Có thể khôi phục deleted records bằng setting `isdeleted = FALSE`
- **Views**: Mỗi table có对应的 `<table>_active` view cho convenience queries

### Triggers Tự Động

Database tự động updated các fields:

1. **`update_*_updated_at` trigger** (fire khi UPDATE):
   - Updates `updated_at`
   - Updates `updateddate`, `updateduser`
   - Updates `cdc_timestamp`, `cdc_version` (tự tăng)

2. **`soft_delete_*` trigger** (fire khi DELETE):
   - Sets `isdeleted = TRUE`
   - Sets `deleteddate`, `deleteduser`, `deletednote`
   - Updates `cdc_timestamp`, `cdc_version`

### Sử dụng Audit Utilities

Để dễ dàng làm việc với audit fields trong controllers:

```typescript
import {
  getInsertAuditFields,
  getUpdateAuditFields,
  getActiveRecordsFilter,
  getSoftDeleteFields,
} from "../utils/audit.js";
```

#### INSERT với Audit Fields

```typescript
import { getInsertAuditFields } from "../utils/audit.js";

// Trong controller
const auditFields = getInsertAuditFields(req);
await query(
  "INSERT INTO transactions (..., createduser, updateduser) VALUES (..., $6, $7)",
  [title, amount, auditFields.createduser, auditFields.updateduser]
);
```

**Lưu ý**: Audit fields sẽ tự động lấy email từ `req.user.email`. Nếu không có, sẽ dùng `'SYSTEM'`.

#### UPDATE với Audit Fields

```typescript
import { getUpdateAuditFields } from "../utils/audit.js";

const auditFields = getUpdateAuditFields(req);
await query(
  "UPDATE transactions SET title = $1, updateduser = $2 WHERE id = $3",
  [title, auditFields.updateduser, id]
);
```

#### Query Chỉ Active Records

```typescript
import { getActiveRecordsFilter } from "../utils/audit.js";

// Chỉ lấy records chưa bị xóa
const result = await query(
  `SELECT * FROM transactions WHERE user_id = $1 AND ${getActiveRecordsFilter()}`,
  [userId]
);

// Sau khi runtime: "SELECT * FROM transactions WHERE user_id = $1 AND isdeleted = FALSE"
```

#### Lấy Deleted Records (如果有 cần)

```typescript
import { getDeletedRecordsFilter } from "../utils/audit.js";

// Chỉ lấy records đã bị xóa
const result = await query(
  `SELECT * FROM transactions WHERE user_id = $1 AND ${getDeletedRecordsFilter()}`,
  [userId]
);

// Sau khi runtime: "SELECT * FROM transactions WHERE user_id = $1 AND isdeleted = TRUE"
```

#### Soft Delete Manual

```typescript
import { getSoftDeleteFields } from "../utils/audit.js";

const softDeleteFields = getSoftDeleteFields(req, "User requested deletion");
await query(
  "UPDATE transactions SET isdeleted = $1, deleteduser = $2, deletednote = $3 WHERE id = $4",
  [softDeleteFields.isdeleted, softDeleteFields.deleteduser, softDeleteFields.deletednote, id]
);
```

**Lưu ý**: Trong thực tế, DELETE trigger sẽ tự động handle soft delete, nên không cần manual.

### Examples trong Controller

Đã implement trong `auth.controller.ts`:

```typescript
export class AuthController {
  async register(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    // ... validation ...
    
    // Create user với audit fields
    const auditFields = getInsertAuditFields(req);
    const userResult = await query(
      "INSERT INTO users (email, password, full_name, createduser, updateduser) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [email, hashedPassword, fullName || null, auditFields.createduser, auditFields.updateduser]
    );

    // Create default settings với audit fields
    await query(
      "INSERT INTO settings (user_id, createduser, updateduser) VALUES ($1, $2, $3)",
      [createdUser.id, auditFields.createduser, auditFields.updateduser]
    );
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const { fullName, avatar } = req.body;
    const auditFields = getUpdateAuditFields(req);

    const result = await query(
      "UPDATE users SET full_name = COALESCE($1, full_name), avatar = COALESCE($2, avatar), updateduser = $3 WHERE id = $4 RETURNING *",
      [fullName || null, avatar || null, auditFields.updateduser, req.user!.id]
    );
  }
}
```

### Lợi ích của Audit & CDC

1. **Compliance**: Đáp ứng yêu cầu audit trail từ security standards (SOC 2, ISO 27001, etc.)
2. **DebugGING**: Biết chính xác ai thao tác gì, khi nào
3. **Recovery**: Dữ liệu không bị mất vĩnh viễn, có thể khôi phục
4. **CDC**: `cdc_timestamp` và `cdc_version` giúp incremental sync với downstream systems
5. **Accountability**: Hiển thị rõ trách nhiệm của từng user action

### Database Views cho Convenience

Mỗi table có corresponding `<table>_active` view:

```sql
-- Ví dụ: users_active view
CREATE OR REPLACE VIEW users_active AS 
SELECT * FROM users 
WHERE isdeleted = FALSE;
```

Sử dụng trong queries:

```typescript
SELECT * FROM users_active WHERE id = $1;  -- Tự động filter out deleted records
```

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload

# Building
npm run build            # Compile TypeScript to JavaScript

# Production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier
```

### Raw SQL Queries

Dự án sử dụng raw SQL queries thay vì ORM. Ví dụ:

```typescript
// Get user by email
const result = await query("SELECT * FROM users WHERE email = $1", [email]);

// Create transaction
const result = await query(
  `INSERT INTO transactions (user_id, category_id, title, amount, type, status, date, notes)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
   RETURNING *`,
  [userId, categoryId, title, amount, type, status, date, notes]
);

// Get transactions with JOIN and filters
const result = await query(
  `SELECT t.*, c.name as category_name, c.icon, c.color
   FROM transactions t
   JOIN categories c ON t.category_id = c.id
   WHERE t.user_id = $1 AND t.date >= $2 AND t.date <= $3
   ORDER BY t.date DESC`,
  [userId, startDate, endDate]
);
```

### Code Style

- Dùng 2 spaces cho indentation
- Dùng double quotes
- Dùng semicolons
- Follow TypeScript best practices
- Run `npm run format` trước khi commit
- SQL queries dùng `$1, $2, ...` cho parameterized queries (prevents SQL injection)

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.

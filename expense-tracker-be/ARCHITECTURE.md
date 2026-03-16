# Expense Tracker Backend - Architecture & Design Document

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Patterns](#architecture-patterns)
3. [Component Diagram](#component-diagram)
4. [Data Flow](#data-flow)
5. [API Request Flow](#api-request-flow)
6. [Database Schema Diagram](#database-schema-diagram)
7. [Authentication Flow](#authentication-flow)
8. [Transaction Management Flow](#transaction-management-flow)
9. [Audit Trail Flow](#audit-trail-flow)
10. [Deployment Architecture](#deployment-architecture)

---

## System Overview

Expense Tracker Backend là một RESTful API được xây dựng với:

- **Node.js + TypeScript** - Runtime và programming language
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **Raw SQL (node-postgres)** - Data access layer
- **JWT** - Stateless authentication
- **Docker** - Containerization

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Applications                        │
│  (Vue.js Frontend, Mobile Apps, Third-party Integrations)        │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTP/HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API Gateway / Load Balancer                  │
│                    (Nginx / Cloudflare / ALB)                    │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Express.js Application Server                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │ │
│  │  │   Routes     │  │ Controllers  │  │  Middleware  │   │ │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │ │
│  │         │                 │                 │           │ │
│  │  ┌──────▼─────────────────▼─────────────────▼───────┐   │ │
│  │  │             Business Logic Layer                 │   │ │
│  │  └────────────────────────────┬────────────────────┘   │ │
│  │                                 │                       │ │
│  │  ┌──────────────────────────────▼──────────────────┐  │ │
│  │  │           Database Client (node-postgres)       │  │ │
│  │  └──────────────────────────────┬──────────────────┘  │ │
│  └─────────────────────────────────┼──────────────────────┘ │
└────────────────────────────────────┼────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                           │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐ │
│  │    Users     │ Transactions │   Budgets    │  Categories  │ │
│  ├──────────────┼──────────────┼──────────────┼──────────────┤ │
│  │   Settings   │  Recurring   │              │              │ │
│  │              │  Transactions│              │              │ │
│  └──────────────┴──────────────┴──────────────┴──────────────┘ │
│                                                                  │
│  - Audit Fields (createddate, updateddate, cdc_timestamp...)     │
│  - Soft Delete (isdeleted = TRUE/FALSE)                          │
│  - Triggers (auto update timestamps, soft delete)               │
│  - Indexes (optimized query performance)                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Architecture Patterns

### 1. **Layered Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                         │
│  (Routes + Swagger Documentation)                             │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                          │
│  (Controllers + Middleware + Validation)                      │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                       │
│  (Business Rules + Audit Utilities + Hashing)                 │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Access Layer                          │
│  (Raw SQL Queries via node-postgres)                          │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Storage Layer                         │
│  (PostgreSQL Database + Audit Fields + Triggers)              │
└─────────────────────────────────────────────────────────────┘
```

### 2. **MVC (Model-View-Controller)**

- **Model**: TypeScript interfaces + Database schema
- **View**: JSON API responses
- **Controller**: Request handlers → Business logic → Data access

### 3. **Middleware Pattern**

Express middleware chain:

```
Incoming Request →
  1. CORS Middleware →
  2. Helmet Middleware →
  3. Morgan (Logging) →
  4. Body Parser →
  5. Auth Middleware (if protected) →
  6. Route Handler →
  7. Controller →
  8. Response
```

### 4. **Repository Pattern (simplified)**

```typescript
// Instead of full repository class, we use query utility
import { query } from "../db/client.js";

const result = await query("SELECT * FROM users WHERE id = $1", [userId]);
```

---

## Component Diagram

### System Components

```mermaid
graph TB
    subgraph "Client Layer"
        FE1[Vue.js Frontend]
        FE2[Mobile App]
        FE3[External APIs]
    end

    subgraph "API Layer"
        API[Express.js Server]
        SWAG[Swagger UI]
    end

    subgraph "Application Layer"
        AUTH[Auth Controller]
        CAT[Categories Controller]
        TRANS[Transactions Controller]
        BUDG[Budgets Controller]
        REC[Recurring Controller]
        SET[Settings Controller]
    end

    subgraph "Middleware Layer"
        MWT[JWT Auth Middleware]
        MERR[Error Handler]
        MVAL[Validation]
    end

    subgraph "Utility Layer"
        HASH[Password Hashing]
        AUDIT[Audit Utilities]
        LOG[Logger]
    end

    subgraph "Data Layer"
        PG[(PostgreSQL DB)]
        USERS[users table]
        CATEGORIES[categories table]
        TRANS_AB[transactions table]
        BUDG_AB[budgets table]
        REC_AB[recurring_transactions table]
        SETTINGS[settings table]
    end

    FE1 -->|HTTP/HTTPS| API
    FE2 -->|HTTP/HTTPS| API
    FE3 -->|HTTP/HTTPS| API
    API --> SWAG
    API --> MWT
    API --> MERR
    API --> MVAL
    MWT --> AUTH
    MWT --> CAT
    MWT --> TRANS
    MWT --> BUDG
    MWT --> REC
    MWT --> SET
    AUTH --> HASH
    CAT --> AUDIT
    TRANS --> AUDIT
    BUDG --> AUDIT
    REC --> AUDIT
    SET --> AUDIT
    ALL[All Controllers] --> LOG
    AUTH --> PG
    CAT --> PG
    TRANS --> PG
    BUDG --> PG
    REC --> PG
    SET --> PG
    PG --> USERS
    PG --> CATEGORIES
    PG --> TRANS_AB
    PG --> BUDG_AB
    PG --> REC_AB
    PG --> SETTINGS
```

---

## Data Flow

### General Data Flow

```
┌──────────────┐
│   Client     │
└──────┬───────┘
       │ HTTP Request (JSON)
       ▼
┌──────────────────────────────────────────────────────────────┐
│                    Middleware Chain                          │
│  1. CORS Headers                                             │
│  2. Security Headers (Helmet)                                │
│  3. Request Logging (Morgan)                                 │
│  4. Parse Request Body                                       │
│  5. Authentication (if protected route)                      │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                    Request Handler                           │
│  - Route Parameter Extraction                                │
│  - Request Body Validation                                   │
│  - Call Controller Method                                    │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                    Controller Logic                          │
│  - Business Rule Validation                                 │
│  - Call Utilities (hashing, audit fields)                   │
│  - Execute Database Query                                    │
│  - Process Results                                           │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                    Database Operation                        │
│  - Raw SQL Query via node-postgres                          │
│  - Parameterized Query                                       │
│  - Triggers Execute (audit fields, soft delete)              │
│  - Return Result Set                                         │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                    Response                                  │
│  - Format Response JSON                                      │
│  - Add Success/Error Metadata                               │
│  - Send to Client                                           │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
┌──────────────┐
│   Client     │
└──────────────┘
```

---

## API Request Flow

### Example: Create Transaction

```mermaid
sequenceDiagram
    participant C as Client
    participant API as Express Server
    participant MW as Middleware
    participant CTRL as Transaction Controller
    participant AUDIT as Audit Utils
    participant DB as PostgreSQL

    C->>API: POST /api/v1/transactions
    Note over API: With JWT Token in Authorization header
    
    API->>MW: Auth Middleware
    MW->>MW: Verify JWT Token
    MW->>MW: Extract User ID
    MW->>CTRL: Pass to controller with user info
    
    CTRL->>CTRL: Validate request body
    Note over CTRL: categoryId, title, amount, type, date
    
    CTRL->>AUDIT: getInsertAuditFields(req)
    AUDIT-->>CTRL: {createduser, updateduser}
    
    CTRL->>DB: INSERT INTO transactions (...)
    Note over DB: Includes audit fields
    Note over DB: Triggers execute: auto-set createddate, etc.
    
    DB-->>CTRL: Created transaction row
    Note over DB: With all audit fields populated
    Note over DB: cdc_version = 1, isdeleted = FALSE
    
    CTRL->>API: Return success response
    API-->>C: 201 Created + Transaction Data
```

---

## Database Schema Diagram

### Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    users ||--|| settings : "has one"
    users ||--o{ transactions : "creates many"
    users ||--o{ budgets : "sets many"
    users ||--o{ recurring_transactions : "schedules many"
    
    categories ||--o{ transactions : "belongs to"
    categories ||--o{ budgets : "applies to"
    categories ||--o{ recurring_transactions : "categorizes"
    
    users {
        uuid id PK
        string email UK
        string password
        string full_name
        string avatar
        timestamp created_at
        timestamp updated_at
        // Audit Fields
        string createduser
        timestamp createddate
        string updateduser
        timestamp updateddate
        boolean isdeleted
        string deleteduser
        timestamp deleteddate
        string deletednote
        timestamp cdc_timestamp
        int cdc_version
    }
    
    settings {
        uuid id PK
        uuid user_id FK
        string currency
        string language
        string theme
        int default_category_expense
        int default_category_income
        timestamp created_at
        timestamp updated_at
        // Audit Fields
        string createduser
        timestamp createddate
        string updateduser
        timestamp updateddate
        boolean isdeleted
        string deleteduser
        timestamp deleteddate
        string deletednote
        timestamp cdc_timestamp
        int cdc_version
    }
    
    categories {
        int id PK
        string name
        string icon
        string color
        string type
        timestamp created_at
        // Audit Fields
        string createduser
        timestamp createddate
        string updateduser
        timestamp updateddate
        boolean isdeleted
        string deleteduser
        timestamp deleteddate
        string deletednote
        timestamp cdc_timestamp
        int cdc_version
    }
    
    transactions {
        uuid id PK
        uuid user_id FK
        int category_id FK
        string title
        decimal amount
        string type
        string status
        date date
        text notes
        timestamp created_at
        timestamp updated_at
        // Audit Fields
        string createduser
        timestamp createddate
        string updateduser
        timestamp updateddate
        boolean isdeleted
        string deleteduser
        timestamp deleteddate
        string deletednote
        timestamp cdc_timestamp
        int cdc_version
    }
    
    budgets {
        uuid id PK
        uuid user_id FK
        int category_id FK
        decimal amount
        decimal spent_amount
        string period
        date start_date
        date end_date
        timestamp created_at
        timestamp updated_at
        // Audit Fields
        string createduser
        timestamp createddate
        string updateduser
        timestamp updateddate
        boolean isdeleted
        string deleteduser
        timestamp deleteddate
        string deletednote
        timestamp cdc_timestamp
        int cdc_version
    }
    
    recurring_transactions {
        uuid id PK
        uuid user_id FK
        int category_id FK
        string title
        decimal amount
        string type
        string recurrence
        date next_due_date
        boolean is_active
        text notes
        timestamp created_at
        timestamp updated_at
        // Audit Fields
        string createduser
        timestamp createddate
        string updateduser
        timestamp updateddate
        boolean isdeleted
        string deleteduser
        timestamp deleteddate
        string deletednote
        timestamp cdc_timestamp
        int cdc_version
    }
```

### Table Relationships Summary

| Table | References | Type | Description |
|-------|-----------|------|-------------|
| `transactions.user_id` | `users.id` | FK, CASCADE | Transactions belong to user, deleted if user deleted |
| `transactions.category_id` | `categories.id` | FK, RESTRICT | Cannot delete category if transactions exist |
| `budgets.user_id` | `users.id` | FK, CASCADE | Budgets belong to user |
| `budgets.category_id` | `categories.id` | FK, RESTRICT | Cannot delete category if budgets exist |
| `recurring_transactions.user_id` | `users.id` | FK, CASCADE | Recurring transactions belong to user |
| `recurring_transactions.category_id` | `categories.id` | FK, RESTRICT | Cannot delete category if recurring transactions exist |
| `settings.user_id` | `users.id` | FK, CASCADE | Settings belong to user (1:1) |

---

## Authentication Flow

### JWT-Based Authentication

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant AUTH as Auth Controller
    participant JWT as JWT Service
    participant DB as PostgreSQL

    Note over U,DB: Registration Flow
    U->>FE: Register (email, password, fullName)
    FE->>AUTH: POST /auth/register
    AUTH->>AUTH: Validate input
    AUTH->>AUTH: Hash password (bcrypt)
    AUTH->>DB: INSERT users (with audit fields)
    DB-->>AUTH: Created user
    AUTH->>DB: INSERT settings (with audit fields)
    AUTH->>DB: INSERT categories (with audit fields)
    AUTH->>JWT: Generate token {id, email}
    JWT-->>AUTH: JWT token
    AUTH-->>FE: {success, user, token}
    FE->>FE: Store token (localStorage/cookie)
    
    Note over U,DB: Login Flow
    U->>FE: Login (email, password)
    FE->>AUTH: POST /auth/login
    AUTH->>DB: SELECT * FROM users WHERE email
    DB-->>AUTH: User record
    AUTH->>AUTH: Verify password (bcrypt)
    AUTH->>JWT: Generate token
    JWT-->>AUTH: JWT token
    AUTH-->>FE: {success, user, token}
    FE->>FE: Store token
    
    Note over U,DB: Protected API Flow
    U->>FE: Get transactions
    FE->>AUTH: GET /transactions
    Note over FE: Authorization: Bearer <token>
    AUTH->>JWT: Verify token
    JWT-->>AUTH: {id: userId, email}
    AUTH->>DB: SELECT transactions WHERE user_id
    Note over DB: Filter active records only (isdeleted = FALSE)
    DB-->>AUTH: Transaction list
    AUTH-->>FE: {success, data: transactions}
    FE-->>U: Display transactions
```

### JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "iat": 1705314000,
    "exp": 1705918800
  },
  "signature": "HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload), secret)"
}
```

### Middleware Authentication

```typescript
// src/middleware/auth.ts
export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // 1. Extract token from Authorization header
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    // 2. Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    
    // 3. Attach user info to request
    req.user = { id: decoded.id, email: decoded.email };
    
    // 4. Get user from database
    const userResult = await query(
      `SELECT * FROM users WHERE id = $1 AND isdeleted = FALSE`,
      [req.user.id]
    );
    
    if (userResult.rows.length === 0) {
      throw new HttpError(401, "Invalid token");
    }
    
    // 5. Continue to controller
    next();
  } catch (error) {
    next(new HttpError(401, "Invalid or expired token"));
  }
};
```

---

## Transaction Management Flow

### Create Transaction with Audit Trail

```mermaid
flowchart TD
    A[Client sends POST /transactions] --> B[Validate Request]
    B --> C[Auth Middleware]
    C --> D[Controller: validate user]
    D --> E[Controller: validate category exists]
    E --> F[Controller: validate transaction data]
    F --> G[Get Audit Fields]
    G --> H[Evaluate: Get createduser from req.user.email]
    H --> I[Prepare INSERT Query]
    I --> J[Execute: INSERT INTO transactions]
    J --> K{Database Trigger}
    K -->|Before Insert| L[Set createddate = CURRENT_TIMESTAMP]
    K -->|Before Insert| M[Set cdc_timestamp = CURRENT_TIMESTAMP]
    K -->|Before Insert| N[Set cdc_version = 1]
    K -->|Before Insert| O[Set isdeleted = FALSE]
    L --> P[Execute INSERT]
    M --> P
    N --> P
    O --> P
    P --> Q[Return created record with audit fields]
    Q --> R[Send response to client]
    
    style G fill:#e1f5fe
    style K fill:#fff9c4
    style L fill:#c8e6c9
    style M fill:#c8e6c9
    style N fill:#c8e6c9
    style O fill:#c8e6c9
```

### Update Transaction with CDC

```mermaid
sequenceDiagram
    participant C as Client
    participant CTRL as Controller
    participant AUDIT as Audit Utils
    participant DB as PostgreSQL
    participant TRG as Triggers

    C->>CTRL: PUT /transactions/:id
    Note over CTRL: Request body: {title: "Updated title"}
    
    CTRL->>AUDIT: getUpdateAuditFields(req)
    AUDIT-->>CTRL: {updateduser: "user@example.com"}
    
    CTRL->>DB: UPDATE transactions SET title = $1, updateduser = $2 WHERE id = $3
    
    Note over DB: UPDATE Trigger Fires
    DB->>TRG: update_transactions_updated_at()
    TRG->>TRG: NEW.updated_at = CURRENT_TIMESTAMP
    TRG->>TRG: NEW.updateddate = CURRENT_TIMESTAMP
    TRG->>TRG: NEW.cdc_timestamp = CURRENT_TIMESTAMP
    TRG->>TRG: NEW.cdc_version = OLD.cdc_version + 1
    TRG->>DB: Return updated row
    
    DB-->>CTRL: Success (with cdc_version incremented)
    CTRL-->>C: 200 OK + Updated transaction
```

---

## Audit Trail Flow

### Soft Delete Mechanism

```mermaid
flowchart LR
    A[Client: DELETE /transactions/:id] --> B[Auth Middleware]
    B --> C[Controller: check ownership]
    C --> D[Controller: execute DELETE]
    D --> E[DB: DELETE FROM transactions WHERE id]
    
    E --> F[Trigger: soft_delete_transactions]
    F --> G[Set isdeleted = TRUE]
    F --> H[Set deleteddate = CURRENT_TIMESTAMP]
    F --> I[Set deleteduser = user.email]
    F --> J[Set cdc_timestamp = CURRENT_TIMESTAMP]
    F --> K[Set cdc_version = OLD.cdc_version + 1]
    
    G --> L[Record stays in DB]
    H --> L
    I --> L
    J --> L
    K --> L
    
    L --> M{Return to Application}
    M -->|isdeleted = TRUE| N[Not visible in normal queries]
    M -->|isdeleted = TRUE| O[Can be restored if needed]
    
    style F fill:#fff9c4
    style G fill:#ffebee
    style H fill:#ffebee
    style I fill:#ffebee
    style J fill:#c8e6c9
    style K fill:#c8e6c9
```

### Query Active vs Deleted Records

```mermaid
graph TB
    subgraph "Query with Active Records Filter"
        A1[SELECT * FROM transactions] --> A2[WHERE user_id = $1]
        A2 --> A3[AND isdeleted = FALSE]
        A3 --> A4[ORDER BY createddate DESC]
    end
    
    subgraph "Query with Deleted Records Filter"
        B1[SELECT * FROM transactions] --> B2[WHERE user_id = $1]
        B2 --> B3[AND isdeleted = TRUE]
        B3 --> B4[ORDER BY deleteddate DESC]
    end
    
    subgraph "Convenience View"
        C1[SELECT * FROM transactions_active] --> C2[WHERE user_id = $1]
        C2 --> C3[Already filtered by isdeleted = FALSE]
    end
    
    style A3 fill:#c8e6c9
    style B3 fill:#ffebee
    style C3 fill:#e1f5fe
```

### Audit Field Lifecycle

```mermaid
stateDiagram-v2
    [*] --> NewRecord: INSERT
    NewRecord --> Active: with createduser, createddate, cdc_version=1
    
    Active --> Updated: UPDATE
    note right of Updated
        updateduser, updateddate
        cdc_version incremented
    end note
    
    Updated --> Active: transaction committed
    
    Active --> SoftDeleted: DELETE
    note right of SoftDeleted
        isdeleted = TRUE
        deleteduser, deleteddate
        cdc_version incremented
    end note
    
    SoftDeleted --> Restored: UPDATE isdeleted = FALSE
    Restored --> Active
    
    SoftDeleted --> [*]: optionally purge after retention period
```

---

## Deployment Architecture

### Docker Compose Deployment

```mermaid
graph TB
    subgraph "Host Machine"
        subgraph "Docker Network"
            subgraph "PostgreSQL Container"
                PG[PostgreSQL 16]
                PORT[Port 5432 -> 5445]
            end
            
            subgraph "API Container"
                API[Node.js + Express]
                ENV[Environment Variables]
                LOGS[Logs Volume]
            end
        end
        
        subgraph "Client Access"
            SWAG[Swagger UI: :3000/api-docs]
            EXT[External Clients]
        end
    end
    
    API -->|DATABASE_URL| PG
    SWAG --> API
    EXT --> API
    API --> LOGS
    PORT -->|Exposed to Host| SWAG
    PORT -->|Exposed to Host| EXT
```

### Environment Configuration

```env
NODE_ENV=production
PORT=3000
API_VERSION=v1

# Database
DB_HOST=postgres
DB_PORT=5432
DB_USER=expense_tracker
DB_PASSWORD=secure_password_here
DB_NAME=expense_tracker_db
DATABASE_URL=postgresql://expense_tracker:secure_password_here@postgres:5432/expense_tracker_db

# JWT
JWT_SECRET=random-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://yourdomain.com

# Logging
LOG_LEVEL=info
```

### Scaling Considerations

```
                    ┌─────────────────┐
                    │  Load Balancer  │
                    │     (Nginx)     │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  API Server 1 │    │  API Server 2 │    │  API Server N │
│  (Node.js)    │    │  (Node.js)    │    │  (Node.js)    │
└───────┬───────┘    └───────┬───────┘    └───────┬───────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  PostgreSQL     │
                    │  (Primary DB)   │
                    │  (Replica DB)   │
                    └─────────────────┘
```

### Security Architecture

```
┌────────────────────────────────────────────────────────┐
│                     Security Layers                     │
├────────────────────────────────────────────────────────┤
│ 1. Network Security                                    │
│    - HTTPS/TLS Encryption                               │
│    - Firewall Rules                                     │
│    - DDoS Protection                                    │
├────────────────────────────────────────────────────────┤
│ 2. Application Security                                 │
│    - Helmet.js (Security Headers)                       │
│    - CORS (Cross-Origin Resource Sharing)               │
│    - Rate Limiting                                      │
│    - Input Validation                                   │
├────────────────────────────────────────────────────────┤
│ 3. Authentication & Authorization                       │
│    - JWT Tokens                                         │
│    - bcrypt Password Hashing                            │
│    - Protected Routes                                   │
│    - Role-Based Access Control (future)                 │
├────────────────────────────────────────────────────────┤
│ 4. Data Security                                        │
│    - SQL Injection Prevention (Parameterized Queries)   │
│    - Audit Trail (CDC)                                  │
│    - Soft Delete (Data Recovery)                        │
│    - Database Encryption (at rest)                      │
├────────────────────────────────────────────────────────┤
│ 5. Compliance                                           │
│    - GDPR Ready (Audit Trail)                           │
│    - SOC 2 Ready (Change Tracking)                      │
│    - Data Retention Policies                            │
└────────────────────────────────────────────────────────┘
```

---

## Technology Stack Rationale

### Why **Raw SQL** instead of ORM?

| Aspect | Raw SQL (node-postgres) | ORM (Prisma/Drizzle) |
|--------|------------------------|---------------------|
| **Performance** | ✅ Direct control, no overhead | ⚠️ Additional abstraction layer |
| **Learning Curve** | ✅ Standard SQL knowledge | ⚠️ New DSL to learn |
| **Debugging** | ✅ Easy to trace queries | ⚠️ Harder to debug generated queries |
| **Complex Queries** | ✅ Full power of SQL | ⚠️ Limited by ORM capabilities |
| **Code Clarity** | ✅ Explicit queries | ❌ Magic methods |
| **Type Safety** | ⚠️ Manual TypeScript interfaces | ✅ Auto-generated types |
| **Relationships** | ⚠️ Manual JOINs | ✅ Auto-handled |
| **Migrations** | ⚠️ Manual files | ✅ Auto-managed |

**Decision**: Use Raw SQL for this project because:

- Simplicity and transparency
- Better understanding of database operations
- Easier optimization when needed
- No additional dependencies

### Why **PostgreSQL**?

- Robust relational database
- Excellent JSON support (for future features)
- Advanced indexing (GIN, GiST)
- Full-text search capabilities
- ACID compliance
- Extensible (custom functions, triggers)

### Why **JWT**?

- Stateless authentication
- No server-side session storage
- Easy to implement
- Widely adopted standard
- Supports distributed systems

### Why **Audit Fields & CDC**?

- Regulatory compliance (SOC 2, ISO 27001)
- Data recovery (soft delete)
- Change tracking (debugging)
- Incremental sync (CDC)
- Accountability

---

## Future Enhancements

### Short-term

1. **Caching Layer**
   - Redis for frequently accessed data
   - Cache categories, user sessions

   ```typescript
   // Get category with caching
   const cached = await redis.get(`category:${id}`);
   if (cached) return JSON.parse(cached);
   
   const category = await query("SELECT * FROM categories WHERE id = $1", [id]);
   await redis.setex(`category:${id}`, 3600, JSON.stringify(category));
   ```

2. **Rate Limiting**
   - Prevent abuse
   - Protect against DDoS

   ```typescript
   // Express-rate-limit
   app.use(rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP
   }));
   ```

3. **Input Validation Library**
   - Use Zod or Joi
   - Better error messages

   ```typescript
   const registerSchema = z.object({
     email: z.string().email(),
     password: z.string().min(8),
     fullName: z.string().optional()
   });
   ```

4. **Unit & Integration Tests**
   - Jest for testing
   - Test coverage > 80%

   ```typescript
   describe('AuthController', () => {
     it('should register new user', async () => {
       // test logic
     });
   });
   ```

### Long-term

1. **Real-time Features**
   - WebSocket support
   - Live transaction updates
   - Push notifications

2. **Advanced Analytics**
   - Data warehouse (ClickHouse)
   - Business intelligence (BI)
   - Machine learning predictions

3. **Multi-tenant Architecture**
   - Multiple organizations
   - Tenant isolation
   - Role-based permissions

4. **Microservices Transition**
   - Separate authentication service
   - Payment processing service
   - Notification service

---

## Appendix

### Error Response Format

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {
      "field": "email",
      "message": "Invalid email format"
    }
  }
}
```

### Success Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Grocery Shopping",
    "amount": "150.00"
  }
}
```

### HTTP Status Codes

| Status Code | Usage |
|-------------|-------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 204 | No Content - Successful but no content |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation error |
| 500 | Internal Server Error - Server error |

---

## References

- [Express.js Documentation](https://expressjs.com/)
- [node-postgres (pg) Documentation](https://node-postgres.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io/)
- [Swagger/OpenAPI Specification](https://swagger.io/specification/)
- [Docker Documentation](https://docs.docker.com/)

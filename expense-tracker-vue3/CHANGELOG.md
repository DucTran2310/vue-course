# Change Log - Tính năng Đổi Mật khẩu với 2FA OTP

## 📅 Ngày: 17/03/2026

## 🎯 Tổng quan

Thêm tính năng đổi mật khẩu với xác thực 2 yếu tố (2FA) qua email OTP, cải thiện bảo mật cho ứng dụng Expense Tracker.

---

## 🔐 Tính năng mới

### 1. Change Password với OTP Verification (2FA)

#### Frontend (`expense-tracker-vue3/`)

**File mới/Cập nhật:**

| File | Mô tả |
|------|-------|
| `src/views/ChangePassword.vue` | View đổi mật khẩu với 3 bước |
| `src/services/api.ts` | Thêm API methods cho OTP |
| `src/stores/authStore.ts` | Thêm actions cho OTP password change |
| `src/router/index.ts` | Route `/change-password` |

**Quy trình 3 bước:**

```
┌─────────────────────────────────────────────────────────────┐
│  Bước 1: Nhập mật khẩu hiện tại  →  Gửi OTP                │
│                      ↓                                      │
│  Bước 2: Nhập OTP (6 số)  →  Xác nhận                      │
│                      ↓                                      │
│  Bước 3: Nhập mật khẩu mới  →  Đổi thành công              │
└─────────────────────────────────────────────────────────────┘
```

**Step Indicator UI:**

```
○─────○─────○
Xác nhận  OTP  Đổi mật khẩu
```

**Features:**

- ✅ Toggle hiển thị/ẩn mật khẩu (👁️/🙈)
- ✅ Email hiển thị nhận OTP
- ✅ OTP input với styling đặc biệt (tracking 8px, font-mono)
- ✅ Validation real-time
- ✅ Success/Error feedback
- ✅ Auto-redirect sau 2 giây khi thành công

---

#### Backend (`expense-tracker-be/`)

**Files mới:**

| File | Mô tả |
|------|-------|
| `src/middleware/rateLimiter.ts` | Rate limiting middleware |
| `src/controllers/passwordReset.controller.ts` | OTP controller |
| `src/database/migrations/003_add_password_change_otps.sql` | Migration table |
| `src/routes/auth.ts` | Routes mới (updated) |

---

### 2. Rate Limiting Middleware

**File:** `src/middleware/rateLimiter.ts`

```typescript
export const rateLimiters = {
  // Change password: 5 attempts / 15 minutes
  changePassword: createRateLimiter({
    windowMs: 15 * 60 * 1000,
    maxAttempts: 5,
    message: "Too many password change attempts. Please try again later.",
  }),
  
  // Login: 10 attempts / 15 minutes
  login: createRateLimiter({
    windowMs: 15 * 60 * 1000,
    maxAttempts: 10,
    message: "Too many login attempts. Please try again later.",
  }),
  
  // Register: 5 attempts / 1 hour
  register: createRateLimiter({
    windowMs: 60 * 60 * 1000,
    maxAttempts: 5,
    message: "Too many registration attempts. Please try again later.",
  }),
  
  // Email verification: 10 attempts / 1 hour
  verifyEmail: createRateLimiter({
    windowMs: 60 * 60 * 1000,
    maxAttempts: 10,
    message: "Too many verification attempts. Please try again later.",
  }),
};
```

**Features:**

- In-memory store (Map) cho rate limiting
- Auto-cleanup mỗi 5 phút
- Hỗ trợ identifier bằng user ID hoặc IP
- Response header `Retry-After` khi bị limit

---

### 3. Password Strength Validation

**File:** `src/controllers/passwordReset.controller.ts`

```typescript
// Password strength validation
if (newPassword.length < 8) {
  throw new HttpError(400, "New password must be at least 8 characters long");
}

// Check for password complexity
const hasUppercase = /[A-Z]/.test(newPassword);
const hasLowercase = /[a-z]/.test(newPassword);
const hasNumber = /[0-9]/.test(newPassword);
const hasSpecialChar = /[!@#$%^&*()_+\-={};':"\\|,.<>?/]/.test(newPassword);

const strengthScore = [hasUppercase, hasLowercase, hasNumber, hasSpecialChar].filter(
  Boolean
).length;

if (strengthScore < 3) {
  throw new HttpError(
    400,
    "New password must contain at least 3 of the following: uppercase letters, lowercase letters, numbers, special characters"
  );
}

// New password must be different from current password
if (currentPassword === newPassword) {
  throw new HttpError(400, "New password must be different from current password");
}
```

**Yêu cầu mật khẩu:**

- ✅ Tối thiểu 8 ký tự
- ✅ Ít nhất 3/4 loại ký tự: chữ HOA, chữ thường, số, ký tự đặc biệt
- ✅ Khác với mật khẩu hiện tại

---

### 4. Email Notifications

#### Email OTP (Bước 1)

**Subject:** `[Expense Tracker] Mã OTP xác nhận đổi mật khẩu`

**Nội dung:**

- Mã OTP 6 số (highlight lớn, letter-spacing 8px)
- Thời gian hiệu lực: 10 phút
- Cảnh báo bảo mật (không chia sẻ OTP)
- Hướng dẫn nếu không yêu cầu đổi mật khẩu

#### Email Confirmation (Bước 3 - Thành công)

**Subject:** `[Expense Tracker] Mật khẩu của bạn đã được thay đổi thành công`

**Nội dung:**

- Thông báo thành công
- Thời gian đổi mật khẩu
- Tips bảo mật tài khoản
- Link truy cập tài khoản

---

### 5. Database Schema

**Migration:** `003_add_password_change_otps.sql`

```sql
CREATE TABLE IF NOT EXISTS password_change_otps (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    createduser VARCHAR(255) DEFAULT 'SYSTEM',
    updateduser VARCHAR(255) DEFAULT 'SYSTEM',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE,
    deleteddate TIMESTAMP WITH TIME ZONE,
    deleteduser VARCHAR(255)
);

-- Indexes for performance
CREATE INDEX idx_password_change_otps_user_id ON password_change_otps(user_id);
CREATE INDEX idx_password_change_otps_otp ON password_change_otps(otp);
CREATE INDEX idx_password_change_otps_expires_at ON password_change_otps(expires_at);
CREATE INDEX idx_password_change_otps_is_used ON password_change_otps(is_used);
```

---

## 📡 API Endpoints

### POST `/api/v1/auth/request-password-change`

**Yêu cầu:**

- Header: `Authorization: Bearer <token>`
- Body:

```json
{
  "currentPassword": "oldPassword123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "OTP has been sent to your email address",
  "data": {
    "otpExpiresIn": 600
  }
}
```

---

### POST `/api/v1/auth/verify-otp-and-change-password`

**Yêu cầu:**

- Header: `Authorization: Bearer <token>`
- Body:

```json
{
  "otp": "123456",
  "newPassword": "newSecurePassword123!"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 🔒 Security Features Summary

| Feature | Description |
|---------|-------------|
| **Rate Limiting** | 5 lần thử đổi mật khẩu / 15 phút |
| **2FA OTP** | Mã 6 số gửi email, hiệu lực 10 phút |
| **Password Strength** | 8+ ký tự, 3/4 loại ký tự |
| **Email Notification** | Thông báo khi đổi mật khẩu |
| **Audit Logging** | Ghi log tất cả actions |
| **Soft Delete** | OTP records soft-deleted sau khi dùng |
| **Cascade Delete** | Xóa OTP khi xóa user |

---

## 📦 Dependencies

Không có dependencies mới. Sử dụng:

- `crypto` (Node.js built-in) cho OTP generation
- Existing email service cho gửi email
- Existing JWT authentication

---

## 🧪 Testing

### Manual Test Flow

1. **Login** vào ứng dụng
2. **Navigate** đến `/change-password` (từ User Menu → "🔑 Đổi mật khẩu")
3. **Bước 1:** Nhập mật khẩu hiện tại → Click "Gửi mã OTP"
4. **Kiểm tra email:** Lấy mã OTP 6 số
5. **Bước 2:** Nhập OTP → Click "Xác nhận OTP"
6. **Bước 3:** Nhập mật khẩu mới (8+ ký tự, phức tạp) → Click "Đổi mật khẩu"
7. **Kiểm tra email:** Email xác nhận đổi mật khẩu thành công
8. **Redirect** về dashboard

### Test Cases

| Test Case | Expected Result |
|-----------|-----------------|
| Sai mật khẩu hiện tại | Error: "Current password is incorrect" |
| OTP sai/hết hạn | Error: "Invalid or expired OTP" |
| Mật khẩu mới < 8 ký tự | Error: "New password must be at least 8 characters long" |
| Mật khẩu mới không đủ phức tạp | Error: "New password must contain at least 3 of the following..." |
| Mật khẩu mới trùng mật khẩu cũ | Error: "New password must be different from current password" |
| 5 lần thử trong 15 phút | Error 429: "Too many password change attempts" |

---

## 📝 Hướng dẫn sử dụng

### Cho Developer

1. **Chạy migration:**

```bash
cd expense-tracker-be
PGPASSWORD=expense_tracker_password psql -h localhost -p 5445 -U expense_tracker -d expense_tracker_db -f src/database/migrations/003_add_password_change_otps.sql
```

1. **Khởi động backend:**

```bash
npm run dev
```

1. **Khởi động frontend:**

```bash
cd ../expense-tracker-vue3
npm run dev
```

1. **Cấu hình email** (nếu chưa):

```env
EMAIL_USER=your-email@gmail.com
GOOGLE_OAUTH_CLIENT_ID=your-client-id
GOOGLE_OAUTH_CLIENT_SECRET=your-client-secret
GOOGLE_OAUTH_REFRESH_TOKEN=your-refresh-token
EMAIL_FROM=noreply@expense-tracker.com
FRONTEND_URL=http://localhost:5173
```

### Cho User

1. Login vào ứng dụng
2. Click vào avatar/menu ở góc phải trên
3. Chọn "🔑 Đổi mật khẩu"
4. Làm theo hướng dẫn 3 bước
5. Kiểm tra email để lấy OTP
6. Đổi mật khẩu thành công!

---

## 🎨 UI Screenshots

### Step 1: Enter Current Password

```
┌──────────────────────────────────────┐
│           🔐 Đổi Mật Khẩu            │
│                                      │
│  ①─────○─────○                       │
│  Xác nhận  OTP  Đổi mật khẩu        │
│                                      │
│  Mật khẩu hiện tại                   │
│  ┌──────────────────────────────┐   │
│  │ ********              👁️    │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │        Gửi mã OTP            │   │
│  └──────────────────────────────┘   │
└──────────────────────────────────────┘
```

### Step 2: Enter OTP

```
┌──────────────────────────────────────┐
│           🔐 Đổi Mật Khẩu            │
│                                      │
│  ○─────①─────○                       │
│  Xác nhận  OTP  Đổi mật khẩu        │
│                                      │
│  Mã OTP đã được gửi đến email        │
│  user@example.com                    │
│  OTP có hiệu lực trong 10 phút       │
│                                      │
│  Mã OTP (6 số)                       │
│  ┌──────────────────────────────┐   │
│  │    1 2 3 4 5 6               │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │       Xác nhận OTP          │   │
│  └──────────────────────────────┘   │
└──────────────────────────────────────┘
```

### Step 3: Enter New Password

```
┌──────────────────────────────────────┐
│           🔐 Đổi Mật Khẩu            │
│                                      │
│  ○─────○─────①                       │
│  Xác nhận  OTP  Đổi mật khẩu        │
│                                      │
│  ✓ OTP xác nhận thành công!         │
│                                      │
│  Mật khẩu mới                        │
│  ┌──────────────────────────────┐   │
│  │ ********              👁️    │   │
│  └──────────────────────────────┘   │
│  (8+ ký tự, kết hợp chữ hoa, thường, │
│   số và ký tự đặc biệt)             │
│                                      │
│  Xác nhận mật khẩu                   │
│  ┌──────────────────────────────┐   │
│  │ ********              👁️    │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │        Đổi Mật Khẩu          │   │
│  └──────────────────────────────┘   │
└──────────────────────────────────────┘
```

---

## 📚 Tài liệu liên quan

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Kiến trúc hệ thống
- [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md) - Setup Cloudinary
- [README.md](./README.md) - Hướng dẫn chung

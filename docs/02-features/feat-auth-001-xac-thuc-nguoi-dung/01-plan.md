# FEAT-AUTH-001 - Kế Hoạch Triển Khai: Xác Thực Người Dùng (Authentication)

> **Trạng thái:** COMPLETED  
> **Repository:** `back-end` & `front-end`  
> **Ngày lập:** 2026-10-25

---

## 1. MỤC TIÊU & PHẠM VI NGHIỆP VỤ
Cung cấp toàn bộ luồng đăng ký tài khoản, gửi và xác thực mã OTP 6 chữ số qua email, đăng nhập bảo mật cấp phát Access Token (JWT) và Refresh Token, đổi mật khẩu và khôi phục mật khẩu quên.

---

## 2. DANH SÁCH FILE LIÊN QUAN
- **Backend:**
  - `src/routes/auth.route.js` [MODIFY]
  - `src/controllers/auth.controller.js` [MODIFY]
  - `src/middleware/auth.middleware.js` [MODIFY]
  - `src/validators/auth.validator.js` [MODIFY]
  - `src/services/email.service.js` [MODIFY]
- **Frontend:**
  - `src/app/services/auth.service.ts` [MODIFY]
  - `src/app/components/login/` [MODIFY]
  - `src/app/components/register/` [MODIFY]
  - `src/app/components/authencation-otp/` [MODIFY]
  - `src/app/components/forgot-password/` [MODIFY]
  - `src/app/components/change-password/` [MODIFY]

---

## 3. THIẾT KẾ API & CONTRACTS
- `POST /api/auth/register` — Đăng ký tài khoản & gửi mã OTP
- `POST /api/auth/verify-otp` — Xác thực mã OTP kích hoạt tài khoản
- `POST /api/auth/login` — Đăng nhập bằng email/password, trả về Access Token & User Info
- `POST /api/auth/forgot-password` — Yêu cầu cấp mã OTP đặt lại mật khẩu
- `POST /api/auth/reset-password` — Đặt lại mật khẩu mới với OTP

### Chuẩn Envelope
```json
{
  "status": "success",
  "data": {
    "token": "jwt_token_string",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "Nguyen Van A"
    }
  },
  "message": "Login successful"
}
```

---

## 4. PHƯƠNG ÁN KỸ THUẬT & CORE RULES
- **Zero-Comment Policy**: Toàn bộ code trong `auth.controller.js` và `auth.service.ts` tuân thủ nguyên tắc không bình luận.
- **Strict Naming**: camelCase cho các hàm xử lý (`handleLogin`, `verifyOtpCode`), PascalCase cho DTOs và Components.
- **Strict UI Control**: Giữ nguyên bố cục giao diện đăng nhập/đăng ký đã được xây dựng sẵn.

---

## 5. CÁC BƯỚC THỰC HIỆN
1. Cấu hình JWT secret và thời gian hết hạn token.
2. Xây dựng middleware xác thực Bearer token.
3. Thiết lập Zod schemas kiểm tra định dạng email và mật khẩu tối thiểu 6 ký tự.
4. Tích hợp SMTP mailer gửi OTP với thời hạn hiệu lực 5 phút.
5. Kiểm thử luồng end-to-end từ Frontend đến Backend.

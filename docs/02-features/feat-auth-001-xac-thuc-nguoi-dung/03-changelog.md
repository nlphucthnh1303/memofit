# FEAT-AUTH-001 - Nhật Ký Thay Đổi (Changelog)

## [2026-10-25] - Khởi tạo & Hoàn thiện xác thực người dùng
- Thiết lập endpoint `/api/auth/register`, `/api/auth/verify-otp`, `/api/auth/login`.
- Tích hợp Zod validation và mã hóa mật khẩu bcrypt.
- Cấu hình mailer gửi mã OTP kích hoạt tài khoản.
- Hoàn thiện UI đăng nhập, đăng ký và xác nhận mã OTP trên Angular 21.

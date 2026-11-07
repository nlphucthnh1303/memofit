# Core System Rules & Constraints

## 1. Zero-Comment Policy (Tuyệt đối không viết comment)
- **Cấm hoàn toàn mọi dạng comment**: `//`, `/* */`, `<!-- -->`, `#`, docstring nội bộ trong toàn bộ code viết mới hoặc sửa đổi.
- **Nguyên nhân**: Comment do AI sinh ra thường dài dòng, nhanh lỗi thời, gây loãng code và làm tăng chi phí token khi đọc lại context.
- **Giải pháp**: Code phải tự tường minh thông qua cấu trúc module, tên biến/hàm rõ nghĩa, khai báo kiểu dữ liệu (TypeScript Types / DTOs) chặt chẽ. Mọi giải thích kỹ thuật phải lưu tại thư mục `docs/` hoặc xuất ra phản hồi bên ngoài. Comment do người dùng tự tay viết thì giữ nguyên.

## 2. Quy chuẩn đặt tên (Naming Conventions)
- **Biến & Hàm (Variables & Functions)**: Dùng `camelCase` (ví dụ: `getUserProfile`, `isAccountVerified`, `calculateTax`).
- **Class, Interface, Type, Enum, Component**: Dùng `PascalCase` (ví dụ: `UserProfileController`, `PaymentGatewayInterface`, `OrderState`).
- **Hằng số toàn cục & Biến môi trường**: `UPPER_SNAKE_CASE` (ví dụ: `MAX_RETRY_COUNT`, `API_BASE_URL`).
- **API Endpoints**: Danh từ số nhiều, chữ thường, ngăn cách bằng gạch nối `kebab-case` theo chuẩn RESTful (ví dụ: `/api/v1/user-profiles`, `/api/v1/order-items`).
- **File & Thư mục**: Dùng `kebab-case` hoặc `PascalCase` đồng nhất theo convention của từng framework kỹ thuật.

## 3. Quy chuẩn phản hồi & xuất bản sơ đồ (Diagram & Output Presentation)
- Mọi nội dung giải thích có sơ đồ luồng (flowchart, sequence, architecture, data flow) **bắt buộc phải ghi thành file Markdown trong `docs/`** và gửi kèm link `file://`.
- Phản hồi ra chat/terminal phải ngắn gọn, súc tích, trực diện.

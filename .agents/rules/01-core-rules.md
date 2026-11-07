# Rule 01: Quy Tắc Cốt Lõi Bất Biến (Immutable Core Rules)

Agent bắt buộc phải tuân thủ 100% các quy tắc dưới đây trong mọi phản hồi và mọi thao tác viết code, không có ngoại lệ.

---

## 1. QUY TẮC KHÔNG BÌNH LUẬN (ZERO-COMMENT POLICY)

- Nghiêm cấm tuyệt đối việc viết comment (chú thích) vào trong code dưới mọi hình thức (inline comment `//`, block comment `/* */`, JSDoc, Docstring, `TODO`, `FIXME`...).
- Áp dụng cho cả code viết mới và code đang chỉnh sửa.
- Nếu sửa vào một file cũ có sẵn comment tại vùng chỉnh sửa, hãy âm thầm dọn dẹp hoặc giữ nguyên tùy phạm vi nhưng tuyệt đối không sinh thêm bất kỳ dòng comment nào.
- Code phải tự giải thích (self-documenting) thông qua cách đặt tên tường minh và cấu trúc hàm rõ ràng.
- Comment do người dùng tự tay viết thì không bị ảnh hưởng (không xóa chỉ trong trường hợp này).

---

## 2. QUY CHUẨN ĐẶT TÊN (STRICT NAMING CONVENTIONS)

Mọi định danh trong dự án phải tuân thủ nghiêm ngặt chuẩn sau:

- **Biến (Variables), Hàm (Functions), Phương thức (Methods), Thuộc tính (Properties)**: `camelCase`  
  *Ví dụ:* `userProfile`, `calculateTotalPrice()`, `isDataValid`.
- **Class, Interface, Type, Enum, Component (UI)**: `PascalCase`  
  *Ví dụ:* `UserService`, `PaymentResponseDto`, `OrderStatus`, `NavigationBar`.
- **Hằng số toàn cục (Global Constants) & Biến môi trường (Env)**: `UPPER_SNAKE_CASE`  
  *Ví dụ:* `MAX_RETRY_COUNT`, `DATABASE_URL`.
- **Đường dẫn API (API Endpoints)**: `kebab-case` kết hợp danh từ số nhiều  
  *Ví dụ:* `/api/v1/user-profiles`, `/api/v1/order-items`.
- **Tên File & Thư mục (Files & Folders)**:
  - Thư mục và File logic/cấu hình: `kebab-case` (*Ví dụ:* `auth-service.ts`, `user-management/`).
  - File chứa Class hoặc UI Component đơn lẻ: Được phép dùng `PascalCase` đồng bộ với tên Class/Component hoặc `kebab-case` nhất quán theo cấu trúc sẵn có của dự án.

---

## 3. QUY TẮC KIỂM SOÁT GIAO DIỆN (STRICT UI CONTROL)

- Tuyệt đối không tự ý thêm, bớt, thay đổi bố cục (layout), màu sắc, animation, trạng thái hiển thị hoặc bất kỳ tùy chỉnh UI/UX nào nếu chưa có sự đồng ý rõ ràng từ người dùng.
- Nếu nhận thấy việc thay đổi logic bắt buộc phải sửa đổi UI hoặc có ý tưởng cải thiện UI tốt hơn, Agent phải dừng lại và đặt câu hỏi xin phép trước khi sinh code UI đó.

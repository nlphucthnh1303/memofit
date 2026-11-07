---
name: execute
description: Thực thi việc viết code cho tính năng dựa trên bản kế hoạch đã chốt (plan.md), tuân thủ 100% Core Rules (Zero-Comment Policy, Strict Naming, Strict UI Control).
---

# Skill `/execute` — Thực Thi Kế Hoạch Tính Năng Tự Chủ

## 1. Mục Đích
Hiện thực hóa mã nguồn từ `plan.md` thành code thực tế theo chu trình 3 tầng (Database -> Backend Logic -> Frontend UI), tuân thủ nghiêm ngặt Zero-Comment, không hỏi bước trung gian và cập nhật Local DB thành `Completed`.

---

## 2. Quy Trình Thực Thi 5 Bước

### Bước 1: Đọc Kế Hoạch & Cập Nhật Trạng Thái
1. Đọc thông tin tính năng:
   ```bash
   python3 .agents/scripts/feature_db.py get "<feature-code>"
   ```
2. Đọc file `plan.md` và `technical-spec.md` tương ứng.
3. Cập nhật trạng thái thành `In-Progress`:
   ```bash
   python3 .agents/scripts/feature_db.py update-status "<feature-code>" "In-Progress"
   ```

### Bước 2: Triển Khai Code Tuần Tự (Autonomous Execution)
Thực thi liên tục xuyên suốt chu trình:
1. **Tầng Database**: Schema, migrations, models/entities.
2. **Tầng Backend Logic**: Repositories, Services, Controller endpoints, DTO validation.
3. **Tầng Frontend Client**: DTO interfaces, API client services, UI components.

*Lưu ý*: Không dừng lại xin xác nhận bước trung gian. Tự chủ đưa ra quyết định kỹ thuật theo plan đã duyệt.

### Bước 3: Áp Dụng Bộ Quy Tắc Cốt Lõi (Core Rules)
- **Zero-Comment Policy**: Tuyệt đối không sinh comment (`//`, `/* */`, `<!-- -->`, `#`, docstring). Code tự giải thích bằng định danh và cấu trúc.
- **Naming Conventions**: `camelCase` cho biến/hàm, `PascalCase` cho class/types, `kebab-case` cho REST API endpoints.
- **Strict UI Guardrails**: Không tự ý thêm helperText, không gắn icon vào label, thanh filter chuẩn.
- **Zero-Mock-Fallback**: Không tạo data mock, không che giấu lỗi mạng.

### Bước 4: Kiểm Thử & Kiểm Tra Toàn Vẹn (Verification)
1. Chạy typecheck / linter / tests (ví dụ: `npm run build`, `npm test`).
2. Xác minh luồng dữ liệu từ DB tới UI không bị đứt gãy.

### Bước 5: Cập Nhật Trạng Thái & Changelog
1. Cập nhật trạng thái tính năng thành `Completed`:
   ```bash
   python3 .agents/scripts/feature_db.py update-status "<feature-code>" "Completed"
   ```
2. Cập nhật `changelog.md` của tính năng với danh sách file đã chỉnh sửa.
3. Báo cáo ngắn gọn danh sách file đã hoàn thành kèm link `file://`.

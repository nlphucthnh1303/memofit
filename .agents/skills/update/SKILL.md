---
name: update
description: Nâng cấp, mở rộng tính năng đã tồn tại. Phân tích tác động lan truyền (Impact Analysis) đến các callers/consumers, cập nhật code và đồng bộ hóa technical-spec.md và changelog.md.
---

# Skill `/update` — Cập Nhật & Mở Rộng Tính Năng

## 1. Mục Đích
Nâng cấp hoặc mở rộng một tính năng đã tồn tại (`<feature-code>`), rà soát tác động lan truyền (Impact Analysis) đến các callers/consumers, cập nhật mã nguồn theo chuẩn Zero-Comment và đồng bộ hóa tài liệu kỹ thuật.

---

## 2. Quy Trình Thực Thi 4 Bước

### Bước 1: Nạp Ngữ Cảnh & Đánh Giá Tác Động Lan Truyền (Impact Analysis)
1. Lấy thông tin tính năng:
   ```bash
   python3 .agents/scripts/feature_db.py get "<feature-code>"
   ```
2. Đọc file `technical-spec.md` và `plan.md` của tính năng.
3. Quét toàn bộ callers, consumers, imports liên quan để đánh giá tác động phụ (regression risk).

### Bước 2: Thực Thi Chỉnh Sửa Mã Nguồn (Zero-Comment)
1. Chỉnh sửa logic hoặc mở rộng chức năng theo yêu cầu.
2. Tuân thủ 100% Zero-Comment Policy, Strict Naming Conventions, và Strict UI Guardrails.
3. Không sử dụng Mock Fallback.

### Bước 3: Kiểm Thử Toàn Vẹn & Không Gây Lỗi Hồi Quy (Zero Regression)
1. Chạy linter, typecheck, hoặc tests của module.
2. Kiểm tra các module phụ thuộc để đảm bảo không bị đứt gãy luồng dữ liệu.

### Bước 4: Đồng Bộ Hóa Tài Liệu
1. Cập nhật `technical-spec.md` phản ánh đúng sơ đồ / API mới.
2. Ghi nhận chi tiết các thay đổi vào `changelog.md` của tính năng.
3. Báo cáo kết quả và danh sách file đã thay đổi cho người dùng kèm link `file://`.

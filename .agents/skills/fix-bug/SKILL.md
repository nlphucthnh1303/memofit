---
name: fix-bug
description: Định vị nguyên nhân gốc rễ và sửa lỗi dứt điểm theo phân loại (/fix-bug ui <feature-code> hoặc /fix-bug logic <feature-code>), cập nhật changelog.md.
---

# Skill `/fix-bug` (Alias: `/bug`) — Định Vị & Khắc Phục Lỗi Dứt Điểm

## 1. Mục Đích
Phân tích nguyên nhân gốc rễ (Root Cause) dựa trên log, stack trace, hoặc quan sát UI; sửa lỗi triệt để theo phân loại `ui` hoặc `logic`, không dùng giải pháp tạm bợ và ghi chép vào `changelog.md`.

---

## 2. Cú Pháp Lệnh
```bash
/fix-bug ui <feature-code>    # Sửa lỗi giao diện, render, CSS, layout
/fix-bug logic <feature-code> # Sửa lỗi thuật toán, validate, API, query, race condition
```

---

## 3. Quy Trình Thực Thi 4 Bước

### Bước 1: Thu Thập Bằng Chứng & Phân Tích Root Cause
1. Đọc log lỗi, stack trace hoặc kiểm tra runtime error.
2. Kiểm tra `technical-spec.md` và mã nguồn của `<feature-code>` để hiểu luồng thiết kế ban đầu.
3. Sử dụng 5 Whys để xác định điểm gãy vỡ gốc rễ. Không chấp nhận phỏng đoán.

### Bước 2: Khắc Phục Lỗi Theo Phân Loại
- **Nếu là `ui`**:
  - Khắc phục lỗi hiển thị, lệch CSS, tràn responsive.
  - **Giữ nguyên 100% cấu trúc gốc**: Tuyệt đối không tự ý thêm component, modal, đổi màu sắc hay thêm helperText ngoài phạm vi sửa lỗi.
- **Nếu là `logic`**:
  - Sửa thuật toán, validate, query hoặc middleware.
  - Tuân thủ nghiêm ngặt Zero-Comment Policy.
  - Cấm cơ chế Mock Fallback hay gán cờ che giấu lỗi.

### Bước 3: Xác Minh Toàn Vẹn (Verification)
1. Chạy build/test runner để đảm bảo không còn lỗi runtime và không break các tính năng khác.
2. Kiểm tra luồng dữ liệu end-to-end.

### Bước 4: Ghi Nhật Ký Sửa Lỗi (Changelog Entry)
1. Ghi nhận rõ: Nguyên nhân gốc rễ (Root Cause), Giải pháp xử lý (Fix Implementation) và danh sách file thay đổi vào file `changelog.md` của tính năng.
2. Báo cáo kết quả súc tích cho người dùng kèm link `file://`.

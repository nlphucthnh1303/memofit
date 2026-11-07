---
name: write-docs
description: Tạo mới hoặc chuẩn hóa bộ 3 tài liệu (plan.md, technical-spec.md, changelog.md) cho tính năng hoặc tài liệu kiến trúc hệ thống tại docs/.
---

# Skill `/write-docs` — Chuẩn Hóa & Soạn Thảo Tài Liệu

## 1. Mục Đích
Tạo mới hoặc chuẩn hóa bộ tài liệu kỹ thuật cho tính năng (`<feature-code>`) hoặc tài liệu hệ thống (`system`), đảm bảo tuân thủ đúng cây thư mục quy chuẩn `docs/`.

---

## 2. Cú Pháp
```bash
/write-docs <feature-code> # Chuẩn hóa bộ 3 tài liệu của một tính năng
/write-docs system         # Chuẩn hóa tài liệu kiến trúc toàn hệ thống
```

---

## 3. Quy Chuẩn Tài Liệu
- **Cho Tính Năng (`<feature-code>`)**: Lưu tại `docs/features/[module]/[code]-[slug]/`:
  1. `plan.md`: Kế hoạch triển khai, ma trận file, token economy tiering.
  2. `technical-spec.md`: Đặc tả kỹ thuật, contracts, DTO, sơ đồ tuần tự Mermaid.
  3. `changelog.md`: Lịch sử các đợt cập nhật và sửa lỗi.
- **Cho Hệ Thống (`system`)**: Lưu tại `docs/architecture/` và `docs/rules/`:
  - Luồng dữ liệu hệ thống: `docs/architecture/system-flows/`.
  - Quy tắc hoạt động: `docs/rules/active-rules.md`.
- **Yêu cầu xuất bản**: Gửi đường dẫn file tài liệu dạng `file://...` cho người dùng.

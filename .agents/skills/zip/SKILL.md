---
name: zip
description: Đóng gói và lưu trữ các quyết định kỹ thuật, file đã sửa đổi và pending tasks của phiên làm việc hiện tại vào docs/summaries/ trước khi clear ngữ cảnh.
---

# Skill `/zip` — Tóm Tắt & Đóng Gói Phiên Làm Việc

## 1. Mục Đích
Lưu trữ toàn bộ tiến độ, các quyết định kỹ thuật quan trọng, danh sách file đã thao tác và các công việc còn tồn đọng (pending tasks) vào file tóm tắt tại `docs/summaries/[YYYY-MM-DD]-[session-id].md`, cho phép người dùng chạy `/clear` để giải phóng context window mà không bị mất dữ liệu.

---

## 2. Cú Pháp
```bash
/zip
```

---

## 3. Quy Trình Thực Thi
1. Xác định ngày hiện tại (`YYYY-MM-DD`) và mã phiên (ví dụ: timestamp hoặc session-id).
2. Tạo file `docs/summaries/[YYYY-MM-DD]-[session-id].md` với cấu trúc:
   ```markdown
   # Session Summary: [YYYY-MM-DD] [Session-ID]

   ## 1. Các Tính Năng / Nhiệm Vụ Đã Xử Lý
   - [Mã tính năng / Tên công việc]

   ## 2. Danh Sách File Đã Thay Đổi
   - `path/to/modified-file.ts`

   ## 3. Các Quyết Định Kỹ Thuật Đáng Chú Ý
   - [Các quyết định kiến trúc, lựa chọn thư viện, giải pháp sửa lỗi]

   ## 4. Công Việc Tồn Đọng (Pending / Next Steps)
   - [ ] [Công việc cần làm tiếp theo]
   ```
3. Báo cáo file tóm tắt vừa tạo kèm link `file://...` và gợi ý người dùng có thể thực hiện `/clear` an toàn.

---
name: ask
description: Truy vấn kỹ thuật và tư vấn kiến trúc ở Chế độ Cách Ly (Isolated Mode), chỉ đọc (Read-only), không làm thay đổi trạng thái hoặc ô nhiễm ngữ cảnh.
---

# Skill `/ask` — Truy Vấn Kỹ Thuật Ở Chế Độ Cách Ly (Isolated Mode)

## 1. Mục Đích
Cho phép người dùng đặt các câu hỏi kỹ thuật, tra cứu cú pháp, tư vấn giải pháp hoặc rà soát kiến trúc mà không làm biến đổi mã nguồn, không cập nhật DB và không gây ô nhiễm ngữ cảnh làm việc (Zero Context Pollution).

---

## 2. Cú Pháp
```bash
/ask <câu hỏi hoặc vấn đề kỹ thuật>
```

---

## 3. Nguyên Tắc Hoạt Động
- **Read-Only**: Chỉ đọc mã nguồn, tài liệu, và logs hiện có. Tuyệt đối không chỉnh sửa bất kỳ file nào.
- **Không Tạo/Sửa State**: Không cập nhật DB tính năng hay phiên làm việc.
- **Phản Hồi Trực Diện**: Trả lời rõ ràng, ngắn gọn, có dẫn chứng cụ thể từ codebase hoặc tài liệu tiêu chuẩn nếu có.

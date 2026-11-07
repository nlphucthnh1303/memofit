---
name: rule
description: Thẩm định và nạp động quy tắc tùy chỉnh mới vào bộ nhớ active và ghi nhận vào docs/rules/active-rules.md. Từ chối nếu xung đột với 3 quy tắc cốt lõi bất biến.
---

# Skill `/rule` — Quản Lý & Nạp Động Quy Tắc Dự Án

## 1. Mục Đích
Tiếp nhận, thẩm định và bổ sung quy tắc mới cho Agent trong dự án. Quy tắc được lưu trữ lâu dài tại `docs/rules/active-rules.md` và `.agents/rules/`.

---

## 2. Cú Pháp
```bash
/rule <nội dung quy tắc cần thêm>
```

---

## 3. Quy Trình Thẩm Định & Thực Thi
1. **Thẩm Định Xung Đột (Conflict Evaluation)**:
   - Kiểm tra xem quy tắc mới có mâu thuẫn với 3 Quy Tắc Cốt Lõi Bất Biến (Zero-Comment Policy, Strict Naming Conventions, Strict UI Guardrails) hay không.
   - Nếu có xung đột: Từ chối áp dụng ngay lập tức và giải thích lý do vi phạm.
2. **Ghi Nhận Vào Hệ Thống**:
   - Nếu hợp lệ: Cập nhật quy tắc mới vào mục tương ứng trong file `docs/rules/active-rules.md`.
   - Nếu là quy tắc hệ thống quan trọng, tạo file quy tắc riêng trong `.agents/rules/`.
3. **Xác Nhận Kích Hoạt**:
   - Báo cáo xác nhận quy tắc đã được nạp thành công và có hiệu lực ngay trong các tác vụ tiếp theo.

---
name: feature-code
description: Tra cứu nhanh mã định danh (FEATURE_CODE) của một tính năng đã tồn tại. Đầu ra TUYỆT ĐỐI CHỈ TRẢ VỀ DUY NHẤT MÃ TÍNH NĂNG (hoặc NOT_FOUND), không kèm văn bản thừa.
---

# Skill `/feature-code` — Tra Cứu Mã Tính Năng Nhanh

## 1. Mục Đích
Tra cứu tức thì mã định danh tính năng `FEAT-[MODULE]-[NUMBER]` bằng từ khóa.

## 2. Quy Trình Thực Thi
1. Tiếp nhận `<keyword>` từ người dùng.
2. Chạy lệnh:
   ```bash
   python3 .agents/scripts/feature_db.py search "<keyword>" --code-only
   ```
3. **Yêu cầu đầu ra bắt buộc**:
   - Nếu tìm thấy: Trả về **DUY NHẤT** mã tính năng (ví dụ `FEAT-AUTH-001`).
   - Nếu không tìm thấy: Trả về **DUY NHẤT** chuỗi `NOT_FOUND`.
   - **Tuyệt đối không kèm bất kỳ câu chào, giải thích, markdown formatting thừa nào khác**.

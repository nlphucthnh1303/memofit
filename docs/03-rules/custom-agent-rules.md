# Custom Agent Rules (Quy Tắc Tùy Chỉnh Bổ Sung)

> **Mô tả:** Tài liệu này ghi nhận và lưu trữ các quy tắc bổ sung được thêm mới hoặc cập nhật thông qua lệnh `/rule`.  
> **Lưu ý:** Các quy tắc tùy chỉnh tại đây không được mâu thuẫn hoặc ghi đè lên **Quy Tắc Cốt Lõi Bất Biến (Immutable Core Rules)** trong Phần 1.

---

## 1. DANH SÁCH QUY TẮC BỔ SUNG

| ID | Ngày Bổ Sung | Tiêu Đề Quy Tắc | Nội Dung & Phạm Vi Áp Dụng | Trạng Thái |
|---|---|---|---|---|
| `RULE-001` | 2026-10-25 | Spaced Repetition Quality Bound | Thang điểm đánh giá chất lượng ôn tập SM-2 phải nằm nghiêm ngặt trong khoảng số nguyên từ `0` đến `5`. Mọi payload ngoài dải giá trị này phải bị Zod validator từ chối với HTTP 422. | `ACTIVE` |

---

## 2. NHẬT KÝ THAY ĐỔI QUY TẮC
- **2026-10-25**: Khởi tạo tài liệu quy tắc tùy chỉnh theo đặc tả kỹ thuật hệ sinh thái AI Agent.

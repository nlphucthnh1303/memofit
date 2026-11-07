---
name: design-taste-frontend
description: Chống thiết kế generic/slop, áp dụng Art Direction cao cấp lấy cảm hứng từ các thiết kế đoạt giải cho typography, bảng màu, composition và visual rhythm.
---

# Skill `design-taste-frontend` — Định Hướng Thiết Kế Giao Diện Cao Cấp (Art Direction)

## 1. Mục Đích
Nâng tầm trải nghiệm giao diện người dùng, ngăn chặn các thiết kế nghèo nàn, nhạt nhẽo (generic/slop design); áp dụng các nguyên tắc Art Direction chuẩn mực từ các nền tảng thiết kế hàng đầu (Awwwards, One Page Love, Linear, Stripe).

---

## 2. Các Tiêu Chuẩn Thẩm Mỹ Bắt Buộc

### 1. Typography & Hierarchy (Hệ Thống Phông Chữ)
- Tránh dùng font mặc định của trình duyệt; ưu tiên font hiện đại (Inter, Plus Jakarta Sans, Outfit, Geist, v.v.).
- Tỷ lệ tương phản rõ ràng giữa tiêu đề (Heading), phụ đề (Subheading) và nội dung (Body).
- Giới hạn tối đa 2 font family trong cùng một giao diện.

### 2. Color Palette & Dark Mode (Bảng Màu & Chế Độ Tối)
- Tránh các màu thuần cơ bản (red, blue, green thô). Sử dụng bảng màu HSL tinh tế, độ bão hòa được kiểm soát hài hòa.
- Dark mode với các tone màu nền sâu (Slate, Zinc, Obsidian) thay vì đen thuần `#000000`.
- Điểm nhấn (Accents) có mục đích rõ ràng, không lạm dụng quá nhiều màu nổi bật.

### 3. Visual Rhythm & Spacing (Nhịp Điệu Không Gian)
- Áp dụng hệ thống lưới chuẩn (4px / 8px grid system).
- Cho phép khoảng trắng (whitespace) "thở", không nhồi nhét thông tin.
- Bo góc (Border radius), đổ bóng (Shadows/Glassmorphism) phải đồng bộ xuyên suốt ứng dụng.

### 4. Micro-Interactions & Animations
- Hover effects, active states mượt mà với transition thời gian hợp lý (150ms - 250ms, cubic-bezier / ease-out).
- Phản hồi trực quan tức thì khi người dùng tương tác (button click, table row hover, modal enter/exit).
- Tuyệt đối không thêm các animation rườm rà gây cản trở thao tác nhanh của người dùng.

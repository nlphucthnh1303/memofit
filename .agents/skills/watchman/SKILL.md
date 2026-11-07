---
name: watchman
description: Điều khiển Watchman MCP (Passive UI Observer) khởi chạy Chromium headed có nhúng In-Browser HUD, tự động ghi nhận Dual-Snapshot, network telemetry và console logs để điều tra UI bug.
---

# Skill `/watchman` — Giám Sát UI & Telemetry Bằng Watchman MCP

## 1. Mục Đích
Sử dụng Watchman MCP để khởi chạy Chromium headed có nhúng In-Browser HUD, tự động theo dõi, thu thập Dual-Snapshot, network telemetry và console logs phục vụ điều tra lỗi giao diện và trải nghiệm người dùng.

---

## 2. Cú Pháp
```bash
/watchman <host> run
# Ví dụ:
/watchman http://localhost:4200 run
```

---

## 3. Quy Trình Thực Thi
1. **Khởi chạy Watchman Session**:
   - Gọi tool MCP tương ứng của watchman với URL chỉ định.
   - Bật In-Browser HUD để quan sát tương tác thời gian thực.
2. **Thu Thập Dual-Snapshot**:
   - Chụp ảnh màn hình trước và sau tương tác.
   - Thu thập console logs và network requests/responses bị lỗi.
3. **Phân Tích & Báo Cáo**:
   - Lưu trữ dữ liệu quan sát và đính kèm báo cáo vào `changelog.md` của tính năng liên quan nếu phát hiện lỗi.

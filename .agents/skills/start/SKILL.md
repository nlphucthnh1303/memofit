---
name: start
description: Khởi tạo và kích hoạt AI Development Framework cho toàn bộ Workspace Memofit với lời chào thân thiện, báo cáo trạng thái hệ thống và các repository đang hoạt động.
---

# Skill `/start` — Workspace Framework Kickstart & Health Check

## 1. Mục Đích
Khởi tạo và nạp toàn bộ ngữ cảnh dự án, kiểm tra sức khỏe hệ thống (Health Check), kiểm tra cơ sở dữ liệu tính năng `docs/features/features-db.json`, báo cáo các repository đang hoạt động và gửi lời chào kích hoạt workspace.

---

## 2. Quy Trình Thực Thi
1. Đọc file `WORKSPACE.md` tại thư mục gốc để nhận diện các repository mục tiêu (`back-end`, `front-end`).
2. Kiểm tra tính sẵn sàng của công cụ quản lý tính năng `python3 .agents/scripts/feature_db.py`.
3. Kiểm tra các quy tắc hệ thống tại `docs/rules/active-rules.md` và `.agents/rules/`.
4. Xuất lời chào thân thiện bằng tiếng Việt:
   `✨ Hello anh Phúc Thinhj siêu đẹp trai! 🌸 AI Agentic Development Framework (Portable v2.5) đã được kích hoạt thành công cho toàn bộ Workspace! 🚀💖`
5. Báo cáo tình trạng hệ thống:
   - **Framework Version**: `Portable v2.5 (Self-Contained)`
   - **Feature Management**: `feature_db.py` CLI & `docs/features/features-db.json`
   - **Active Repositories**:
     - `back-end`: Node.js, Express 5, Prisma, PostgreSQL, Gemini AI
     - `front-end`: Angular 21, Angular SSR, Tailwind CSS v4, Motion, ONNX TTS
   - **Cây Tài Liệu (Docs Tree)**: `docs/architecture/`, `docs/features/`, `docs/rules/`, `docs/summaries/`
   - **Lệnh Khả Dụng**: `/plan-feature`, `/execute`, `/fix-bug`, `/update`, `/check-flow`, `/refactor-page`, `/feature-code`, `/rule`, `/zip`, `/clear`

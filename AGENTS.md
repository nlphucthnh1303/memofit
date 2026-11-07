# AGENTS.md (Workspace Root — Antigravity / Gemini Entry Point)

## 1. NGUYÊN TẮC CỐT LÕI & QUY CHUẨN BẮT BUỘC (SYSTEM RULES)

1. **Tuyệt đối không viết comment trong code (Zero-Comment Policy)**:
   - Cấm hoàn toàn mọi dạng comment trong toàn bộ mã nguồn (`//`, `/* */`, `<!-- -->`, `#`, docstring). Code phải tự tường minh.
   - Mọi phân tích, giải thích kỹ thuật phải lưu tại `docs/`.
   - Chi tiết: [.agents/rules/core-system-rules.md](./.agents/rules/core-system-rules.md), [docs/rules/active-rules.md](./docs/rules/active-rules.md).

2. **Quy chuẩn đặt tên (Naming Conventions)**:
   - Biến & hàm: `camelCase`.
   - Class, Interface, Type, Component: `PascalCase`.
   - Hằng số toàn cục & Env: `UPPER_SNAKE_CASE`.
   - RESTful API: `kebab-case` danh từ số nhiều (`/api/v1/user-profiles`).
   - File & Folder: Nhất quán theo kiến trúc dự án.

3. **Cấm tùy tiện sửa đổi hoặc bổ sung UI (Strict UI Guardrails)**:
   - Không tự ý thêm bớt component, layout, màu sắc, animation, modal.
   - No Unsolicited helperText: Tuyệt đối không tự ý thêm `helperText`.
   - Filter Bar & Toolbar Standardization: Đồng bộ cấu trúc thanh filter gọn gàng; nút Tạo mới luôn nằm trên Header điều hướng.

4. **Quy chuẩn phản hồi & xuất bản sơ đồ**:
   - Mọi giải thích kèm sơ đồ luồng bắt buộc lưu vào `docs/` và dẫn link `file://`.

---

## 2. QUY CHUẨN QUẢN LÝ TÍNH NĂNG (DOCS TREE)

- Định dạng Feature Code: `FEAT-[MODULE]-[NUMBER]` (Ví dụ: `FEAT-AUTH-001`).
- Quản lý qua Local DB: [`docs/features/features-db.json`](./docs/features/features-db.json) và script CLI [`.agents/scripts/feature_db.py`](./.agents/scripts/feature_db.py).
- Cây tài liệu chuẩn:
  `docs/features/[module]/[feature-code]-[slug]/` (`plan.md`, `technical-spec.md`, `changelog.md`).

---

## 3. BỘ LỆNH ĐIỀU HÀNH (SKILLS)

- `/plan-feature <Tên Tính Năng>`: Lập kế hoạch, cấp phát mã tính năng, đánh giá Token Tier theo [.agents/skills/plan-feature/SKILL.md](./.agents/skills/plan-feature/SKILL.md).
- `/execute <feature-code>`: Triển khai code tự chủ, zero-comment theo [.agents/skills/execute/SKILL.md](./.agents/skills/execute/SKILL.md).
- `/fix-bug <ui | logic> <feature-code>`: Sửa lỗi phân loại, cập nhật changelog theo [.agents/skills/fix-bug/SKILL.md](./.agents/skills/fix-bug/SKILL.md).
- `/update <feature-code>`: Cập nhật tính năng & phân tích tác động lan truyền theo [.agents/skills/update/SKILL.md](./.agents/skills/update/SKILL.md).
- `/check-flow [feature-code | all]`: Kiểm tra luồng dữ liệu 6 tầng theo [.agents/skills/check-flow/SKILL.md](./.agents/skills/check-flow/SKILL.md).
- `/write-docs [feature-code | system]`: Chuẩn hóa tài liệu theo [.agents/skills/write-docs/SKILL.md](./.agents/skills/write-docs/SKILL.md).
- `/refactor-page <path>`: Tái cấu trúc monolithic page thành module sạch theo [.agents/skills/refactor-page/SKILL.md](./.agents/skills/refactor-page/SKILL.md).
- `/feature-code <keyword>`: Tra cứu mã tính năng theo [.agents/skills/feature-code/SKILL.md](./.agents/skills/feature-code/SKILL.md).
- `/ask <câu hỏi>`: Hỏi đáp ở chế độ cách ly theo [.agents/skills/ask/SKILL.md](./.agents/skills/ask/SKILL.md).
- `/rule <quy tắc>`: Nạp động quy tắc mới theo [.agents/skills/rule/SKILL.md](./.agents/skills/rule/SKILL.md).
- `/zip`: Tóm tắt phiên làm việc trước khi clear context theo [.agents/skills/zip/SKILL.md](./.agents/skills/zip/SKILL.md).
- `/clear`: Làm mới bộ nhớ ngữ cảnh theo [.agents/skills/clear/SKILL.md](./.agents/skills/clear/SKILL.md).
- `/start`: Khởi tạo và kiểm tra sức khỏe workspace theo [.agents/skills/start/SKILL.md](./.agents/skills/start/SKILL.md).
- `/watchman <host> run`: Giám sát UI telemetry qua Watchman MCP theo [.agents/skills/watchman/SKILL.md](./.agents/skills/watchman/SKILL.md).
- `design-taste-frontend`: Chuẩn Art Direction cho giao diện theo [.agents/skills/design-taste-frontend/SKILL.md](./.agents/skills/design-taste-frontend/SKILL.md).

---

## 4. QUY TẮC THỰC THI TỰ CHỦ & TƯ DUY PHẢN BIỆN

- **Tư duy phản biện khi lập Plan**: Chất vấn tính cần thiết, loại bỏ slop, phân rã 5 tầng và đánh giá Token Economy.
- **Không hỏi lại khi đang làm (Zero Unnecessary Prompts)**: Làm liên tục từ đầu đến cuối sau khi plan được duyệt.
- **Chống đi đường tắt & Zero-Mock-Fallback**: Cấm chữa cháy tạm bợ, cấm sinh dữ liệu giả khi lỗi mạng.
- **Cách ly Repository (Repository Isolation)**: Chỉ thao tác trên repository được yêu cầu (`back-end` hoặc `front-end`), không sửa chéo nếu chưa được phân công.

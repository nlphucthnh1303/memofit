# CLAUDE.md

## Core Rules & Conventions
1. **Zero-Comment Policy**: Tuyệt đối không viết comment trong code (cấm `//`, `/* */`, `<!-- -->`, `#`, docstrings). Code phải tự tường minh. Mọi giải thích lưu tại `docs/`.
2. **Naming Conventions**: `camelCase` cho biến/hàm, `PascalCase` cho Class/Type, `kebab-case` cho RESTful API endpoints.
3. **Strict UI Guardrails**: Không tự ý thêm layout, component, modal hay helperText. Mọi thay đổi UI phải có yêu cầu trực tiếp.
4. **Autonomous Execution**: Khi đã nhận yêu cầu hoặc duyệt plan, tự chủ ra quyết định kỹ thuật và thực thi liên tục từ đầu đến cuối, không dừng lại hỏi bước trung gian.
5. **Feature Code & Docs**: Định dạng `FEAT-[MODULE]-[NUMBER]`, quản lý qua `docs/features/features-db.json` và script `.agents/scripts/feature_db.py`.

## Commands & Skills
- `/plan-feature`: Lên kế hoạch & thẩm định Token Tiering
- `/execute`: Triển khai code chuẩn 3 tầng (DB -> Logic -> UI)
- `/fix-bug`: Sửa lỗi phân loại `ui` / `logic`
- `/update`: Cập nhật & kiểm tra lan truyền
- `/check-flow`: Kiểm tra toàn vẹn luồng dữ liệu 6 tầng
- `/refactor-page`: Module hóa monolithic page
- `/write-docs`: Chuẩn hóa bộ 3 tài liệu
- `/feature-code`: Tra cứu nhanh mã tính năng
- `/ask`, `/rule`, `/zip`, `/clear`, `/start`, `/watchman`

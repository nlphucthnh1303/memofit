# Antigravity & Gemini Adapter: front-end

## 1. WORKSPACE AI FRAMEWORK SSOT
This repository is governed by the centralized portable AI Development Framework:

- **Workspace Topology**: [`../WORKSPACE.md`](../WORKSPACE.md)
- **Local Project Context**: [`PROJECT.md`](PROJECT.md)
- **Framework Core**: [`../AGENTS.md`](../AGENTS.md)
- **Core Rules**: [`../.agents/rules/`](../.agents/rules/)
- **Documentation & Features DB**: [`../docs/`](../docs/)
- **Repository Isolation**: Do not alter adjacent repositories (`../back-end`) unless explicitly requested.

---

## 2. REPOSITORY RULES & CONTEXT
- All frontend implementations must adhere to [`../.agents/rules/core-system-rules.md`](../.agents/rules/core-system-rules.md) and [`../docs/rules/active-rules.md`](../docs/rules/active-rules.md).
- **Zero-Comment Policy**: Absolute prohibition of code comments (`//`, `/* */`, `<!-- -->`).
- **Strict UI Guardrails**: Không tự ý thêm bớt component, layout, màu sắc, animation, modal.
- **No Unsolicited helperText**: Tuyệt đối không tự ý thêm `helperText` cho bất kỳ `Input`, `Select`, `DatePicker`, `Textarea` hoặc form field nào nếu không có yêu cầu cụ thể từ người dùng.
- **Filter Bar & Toolbar Standardization**: Nút Tạo mới luôn nằm trên Header điều hướng, không đặt trong thân bảng.
- Build clean, standalone Angular 21 components with TypeScript strict mode.

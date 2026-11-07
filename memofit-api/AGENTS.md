# Antigravity & Gemini Adapter: back-end

## 1. WORKSPACE AI FRAMEWORK SSOT
This repository is governed by the centralized portable AI Development Framework:

- **Workspace Topology**: [`../WORKSPACE.md`](../WORKSPACE.md)
- **Local Project Context**: [`PROJECT.md`](PROJECT.md)
- **Framework Core**: [`../AGENTS.md`](../AGENTS.md)
- **Core Rules**: [`../.agents/rules/`](../.agents/rules/)
- **Documentation & Features DB**: [`../docs/`](../docs/)
- **Repository Isolation**: Do not alter adjacent repositories (`../front-end`) unless explicitly requested.

---

## 2. REPOSITORY RULES & CONTEXT
- All backend implementations must adhere to [`../.agents/rules/core-system-rules.md`](../.agents/rules/core-system-rules.md) and [`../docs/rules/active-rules.md`](../docs/rules/active-rules.md).
- **Zero-Comment Policy**: Absolute prohibition of code comments (`//`, `/* */`, docstring).
- **Naming Conventions**: `camelCase` for variables/methods, `PascalCase` for classes/types, `kebab-case` for REST API endpoints.
- Follow Clean Architecture: controllers handle HTTP contracts; services encapsulate business logic and AI orchestration.
- Respect soft-delete conventions (`is_delete = '0'`) in Prisma queries.
- Zero-Mock-Fallback: Cấm tuyệt đối dữ liệu mock giả lập khi có lỗi.

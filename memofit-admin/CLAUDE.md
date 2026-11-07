# CLAUDE.md — Claude Code Adapter for `front-end`

## 1. WORKSPACE AI FRAMEWORK CONTEXT
This repository is governed by the portable AI Development Framework:

- **Workspace Topology**: [`../WORKSPACE.md`](../WORKSPACE.md)
- **Local Project Context**: [`PROJECT.md`](PROJECT.md)
- **Root Rules & Conventions**: [`../CLAUDE.md`](../CLAUDE.md)
- **Core Rules**: [`../.agents/rules/`](../.agents/rules/)
- **Documentation & Features**: [`../docs/`](../docs/)

---

## 2. REPOSITORY ARCHITECTURE & RULES
1. **Active Repository**: `front-end` (Angular 21, Angular SSR, Tailwind CSS v4, Motion).
2. **Repository Isolation**: Do not alter adjacent repositories (`../back-end`) without explicit user permission.
3. **Zero-Comment Policy**: Do not write comments in code (`//`, `/* */`, `<!-- -->`).
4. **Strict UI Guardrails & No Unsolicited helperText**: Tuyệt đối không tự ý thêm `helperText` cho bất kỳ form field nào nếu không có yêu cầu cụ thể từ người dùng.
5. **Standalone Architecture**: Build components as Angular 21 standalone components with strict TypeScript types.

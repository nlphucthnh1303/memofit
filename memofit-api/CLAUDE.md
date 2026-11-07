# CLAUDE.md — Claude Code Adapter for `back-end`

## 1. WORKSPACE AI FRAMEWORK CONTEXT
This repository is governed by the portable AI Development Framework:

- **Workspace Topology**: [`../WORKSPACE.md`](../WORKSPACE.md)
- **Local Project Context**: [`PROJECT.md`](PROJECT.md)
- **Root Rules & Conventions**: [`../CLAUDE.md`](../CLAUDE.md)
- **Core Rules**: [`../.agents/rules/`](../.agents/rules/)
- **Documentation & Features**: [`../docs/`](../docs/)

---

## 2. REPOSITORY ARCHITECTURE & RULES
1. **Active Repository**: `back-end` (Node.js, Express 5, Prisma, PostgreSQL, Gemini AI).
2. **Repository Isolation**: Do not alter adjacent repositories (`../front-end`) without explicit user permission.
3. **Zero-Comment Policy**: Do not write comments in code (`//`, `/* */`, docstring).
4. **Naming Conventions**: `camelCase` variables/functions, `PascalCase` classes/types, `kebab-case` RESTful API endpoints.
5. **Clean Architecture**: Controllers manage HTTP contracts; services encapsulate business logic and AI orchestration. Respect soft-delete conventions (`is_delete = '0'`).

# Workspace Definition: Memofit

**Workspace Root**: `./`  
**Framework Architecture**: Portable & Self-Contained AI Agentic Development Framework  
**Framework Directory**: `.agents/` and `docs/`

---

## 1. PORTABLE AI FRAMEWORK
The workspace uses a self-contained, portable AI Development Framework requiring no external symlinks or dependencies.

- **System Entry Points**:
  - Antigravity / Gemini CLI: [`AGENTS.md`](./AGENTS.md)
  - Claude Code: [`CLAUDE.md`](./CLAUDE.md)
  - Cursor / Windsurf: [`.cursorrules`](./.cursorrules)
- **Core Rules**: [`.agents/rules/`](./.agents/rules/)
  - Zero-Comment Policy, Naming Conventions: [`core-system-rules.md`](./.agents/rules/core-system-rules.md)
  - Autonomous Execution: [`autonomous-execution-rules.md`](./.agents/rules/autonomous-execution-rules.md)
  - Critical Planning & Token Tiering: [`planning-critical-thinking-rules.md`](./.agents/rules/planning-critical-thinking-rules.md)
  - Anti-Shortcut & Verification: [`anti-shortcut-and-verification-rules.md`](./.agents/rules/anti-shortcut-and-verification-rules.md)
  - UI Form & Filter Guardrails: [`ui-form-rules.md`](./.agents/rules/ui-form-rules.md), [`ui-filter-rules.md`](./.agents/rules/ui-filter-rules.md)
- **Feature Management CLI**: [`.agents/scripts/feature_db.py`](./.agents/scripts/feature_db.py)
- **Feature Database**: [`docs/features/features-db.json`](./docs/features/features-db.json)
- **Active Rules**: [`docs/rules/active-rules.md`](./docs/rules/active-rules.md)

---

## 2. ACTIVE REPOSITORIES

| Repository | Path | Role | Project Context |
|---|---|---|---|
| `memofit-web` | [./memofit-web/](./memofit-web/) | Learner Web Application (React, Vite, TypeScript, Tailwind CSS, Framer Motion, Gamified Duolingo UI) | [PROJECT.md](./memofit-web/PROJECT.md) |
| `memofit-admin` | [./memofit-admin/](./memofit-admin/) | Admin Management Portal (Angular 21, Angular SSR, Tailwind CSS, Angular Material, CMS) | [PROJECT.md](./memofit-admin/PROJECT.md) |
| `memofit-api` | [./memofit-api/](./memofit-api/) | Central REST API & Worker Service (Node.js, Express 5, Prisma, PostgreSQL, Gemini AI, SM-2 Engine, PayOS) | [PROJECT.md](./memofit-api/PROJECT.md) |

The workspace root coordinates these three independent repositories. Each repository maintains its own dependencies, configuration, and build artifacts.

---

## 3. REPOSITORY ISOLATION RULES

1. **Identify Active Repository**: Always identify the active repository before performing development work.
2. **Context Ingestion**: Read that repository's `PROJECT.md` and adhere to its technology stack and standards.
3. **Strict Boundaries**: Never modify another repository unless explicitly requested by the user.
4. **No Cross-Pollution**: Do not mix source code, dependencies, configuration, or database assumptions between repositories.
5. **Multi-Repository Tasks**: If a task explicitly spans both repositories:
   - Identify contracts and endpoints between them explicitly.
   - Define exact boundaries and scope for each repository.

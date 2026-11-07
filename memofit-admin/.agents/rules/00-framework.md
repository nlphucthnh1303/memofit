# Rule 00: Shared AI Framework Adapter (front-end)

Active repository: `front-end`. This rule is a thin adapter; framework content lives only in `../AI-FRAMEWORK/.ai/`.

Read, in order:

1. [WORKSPACE.md](../../../WORKSPACE.md)
2. [PROJECT.md](../../PROJECT.md)
3. [MODES.md](../../../AI-FRAMEWORK/.ai/core/MODES.md)
4. [AGENT_PROTOCOL.md](../../../AI-FRAMEWORK/.ai/core/AGENT_PROTOCOL.md)
5. [AGENT_EXECUTION_RULES.md](../../../AI-FRAMEWORK/.ai/core/AGENT_EXECUTION_RULES.md)
6. The relevant workflow in [workflows/](../../../AI-FRAMEWORK/.ai/workflows/) and standards in [standards/](../../../AI-FRAMEWORK/.ai/standards/)

Report `Execution Mode: <MODE_NAME>` in Phase 1 (TRIAGE). Never modify another repository unless explicitly requested. If the framework is missing, report `Shared AI Framework not found.` (expected at `../AI-FRAMEWORK/.ai`) and do not guess.

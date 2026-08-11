# AskQuestion tool

Use when asking the user any targeted question — a clarifying question before main work or a question during a grill.

## Rules

When **`request_user_input`** (Codex), **AskQuestion**, **AskUserTool**, **AskUserChoice**, or an equivalent structured-question tool is available and permitted in the current mode:

- **One question per call** — wait for the answer before continuing
- **Concrete options** — offer 2+ choices; include your recommended answer as an option (label it, e.g. `Recommended: …`)
- **Prompt for context** — brief trade-offs, glossary conflicts, or scenario setup belong in the prompt, not in option labels
- **`allow_multiple`** — only when the decision genuinely requires selecting more than one option

Fall back to chat when the question is open-ended, needs a scenario walkthrough, or cannot be expressed as discrete choices.

### Codex

In Codex, use **`request_user_input`** for discrete questions when the current mode permits it. Some Codex sessions permit this tool only in Plan mode, and the agent cannot switch modes itself. When it is unavailable in the current mode, ask one question in chat and wait for the answer. If structured question controls are important, tell the user they can switch the task to Plan mode in the app.

## Clarifying questions vs grilling

**Clarifying questions** — one question at a time (repeat only when each answer unlocks the next) to unblock scope before the main task. Not a full design interview. Prefer **`request_user_input`** or the available equivalent when options are discrete.

**Grilling** — extended one-question-at-a-time session to resolve terminology, trade-offs, or doc/code conflicts. Always use **`request_user_input`** or the available equivalent when permitted. Apply the grilling techniques in [grill-with-docs](../grill-with-docs/SKILL.md).

Do **not** ask when docs, codebase exploration, or a reasonable default already bound the answer — state assumptions briefly and proceed.

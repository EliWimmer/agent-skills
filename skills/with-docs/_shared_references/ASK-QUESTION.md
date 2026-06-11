# AskQuestion tool

Use when asking the user any targeted question — a clarifying question before main work or a question during a grill.

## Rules

When the **AskQuestion** tool is available:

- **One question per call** — wait for the answer before continuing
- **Concrete options** — offer 2+ choices; include your recommended answer as an option (label it, e.g. `Recommended: …`)
- **Prompt for context** — brief trade-offs, glossary conflicts, or scenario setup belong in the prompt, not in option labels
- **`allow_multiple`** — only when the decision genuinely requires selecting more than one option

Fall back to chat when the question is open-ended, needs a scenario walkthrough, or cannot be expressed as discrete choices.

## Clarifying questions vs grilling

**Clarifying questions** — one question at a time (repeat only when each answer unlocks the next) to unblock scope before the main task. Not a full design interview. Prefer **AskQuestion** when options are discrete.

**Grilling** — extended one-question-at-a-time session to resolve terminology, trade-offs, or doc/code conflicts. Always use **AskQuestion** when available. Apply the grilling techniques in [grill-with-docs](../grill-with-docs/SKILL.md).

Do **not** ask when docs, codebase exploration, or a reasonable default already bound the answer — state assumptions briefly and proceed.

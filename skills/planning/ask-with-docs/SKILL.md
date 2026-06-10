---
name: ask-with-docs
description: Answers project questions using docs/context glossaries, plans, ADRs, and research. Use when the user asks what/why/how about the project, terminology, architecture, scope, or a path/file and wants docs-aware clarification; use /ask-with-docs to invoke.
---

# Ask with docs

Answer the user's question about the project. Load governing docs first, align with canonical domain language, and use codebase exploration when the answer is discoverable there.

If the user did not ask a clear question, ask one targeted clarifying question before going further.

## Read docs first

Before answering, discover and read docs that govern the question area. Do not re-derive vocabulary or decisions already recorded under `docs/`.

```
docs/
├── context/
│   ├── CONTEXT.md
│   ├── CONTEXT-MAP.md
│   └── <bounded-context>/<slug>.md
├── adr/
├── plans/
│   ├── <slug>.md
│   └── progress/<slug>-progress.md
└── research/
    └── YYYY_MM_DD-<slug>.md
```

1. Check whether `docs/` exists; list `plans/`, `context/`, `adr/`, and `research/` when present.
2. Bind the question to artifacts:
   - User-named paths -> read in full.
   - Feature or area named -> search `docs/plans/` and `docs/research/` for the best match, then read it in full.
   - No explicit doc -> still read context glossaries when they exist.
3. Context glossary: follow **Choosing the active glossary** below.
4. Plans in flight: when a plan applies, read the full plan and matching progress file.
5. ADRs and research: read linked or topic-relevant files before architectural, terminology-sensitive, or trade-off-heavy answers.

Read entire plan and progress files - do not skim. Use canonical terms from glossaries; do not contradict accepted ADRs without calling out the conflict.

**Legacy:** repo-root or nested `CONTEXT.md` outside `docs/context/` may still exist - read as fallback; prefer `docs/context/` when present.

## Domain awareness

During codebase exploration, also look for existing documentation.

### File structure

All context glossaries live under `docs/context/`:

```
docs/
├── context/
│   ├── CONTEXT.md              ← cross-cutting terms only
│   ├── CONTEXT-MAP.md          ← index of bounded contexts (when more than one)
│   ├── explorer/
│   │   ├── tab-lifecycle.md
│   │   └── saved-views.md
│   └── plugins/
│       └── preview-dmg.md
└── adr/
    ├── 0001-event-sourced-orders.md
    └── 0002-postgres-for-write-model.md
```

**Top-level `docs/context/CONTEXT.md`:** cross-cutting terms that span multiple bounded contexts or have no single owner.

**Sub-context files:** `docs/context/<subdir>/<slug>.md` - one cohesive glossary cluster per file. Subdirectories are semantic bounded-context names (kebab-case), not mirrors of `src/`.

Create files lazily - only when you have something to write. If `docs/context/` does not exist, create it when the first term is resolved. If no `docs/adr/` exists, create it when the first ADR is needed.

### Legacy context files

If the repo still uses the old layout (repo-root `CONTEXT.md`, nested `CONTEXT.md` under `src/`, etc.), read them as fallback but recommend [context-cleanup](../context-cleanup/SKILL.md) to migrate.

### Choosing the active glossary

**At session start:**

1. Read `docs/context/CONTEXT-MAP.md` if it exists
2. Infer the bounded context from the user's question, code paths, or feature area
3. If a matching sub-context file exists -> use it as the **active glossary**
4. If unclear -> ask one targeted question
5. If no map and no sub-contexts -> use `docs/context/CONTEXT.md`
6. If `docs/context/` does not exist but a legacy root `CONTEXT.md` does -> read the legacy file

**During the session (writes):**

- New terms go into the **active glossary**
- Cross-cutting terms go into `docs/context/CONTEXT.md`
- When a cluster of related terms clearly belongs in a separate bounded context -> **mid-session split**: create `docs/context/<subdir>/<slug>.md`, add an entry to `CONTEXT-MAP.md`, move terms there, add `## Related` links, continue in the new file

**Cross-cutting vs sub-context:** cross-cutting terms appear without a single owner; sub-context terms only make sense inside one feature area.

**Conflict check:** scan top-level `docs/context/CONTEXT.md` and the active sub-context before adding a term - challenge duplicates and contradictions across files.

## Answering

Use the docs and code to answer precisely:

1. State the answer in canonical project language.
2. Distinguish what the docs say, what the code shows, and what is inferred.
3. Cite the most relevant doc and code paths instead of paraphrasing long excerpts.
4. If the answer depends on a trade-off or historical decision, point to the relevant ADR or plan.

If the question can be answered by exploring the codebase, explore the codebase instead of asking.

## When to grill

Default to answering. Switch to a **grill** - one question at a time, with a recommended answer each, waiting for feedback before continuing - only when:

- A glossary term conflict blocks the correct answer
- User intent is ambiguous enough that the answer would depend on a missing distinction
- Code and docs contradict each other and authority is unclear
- The answer would otherwise violate an accepted ADR or a documented decision

Do not grill when a quick code/doc read resolves the question.

During a grill, apply the same techniques as [grill-with-docs](../grill-with-docs/SKILL.md): challenge against the glossary, sharpen fuzzy language, stress-test with concrete scenarios, and cross-reference with code.

When the **AskQuestion** tool is available, use it for grilling:

- One question per call - wait for the answer before asking the next
- Concrete options - offer 2+ choices; include your recommended answer as an option
- Prompt for context - brief trade-offs, glossary conflicts, or scenario setup belong in the prompt, not in option labels
- `allow_multiple` - only when the decision genuinely requires selecting more than one option

Fall back to chat when the question is open-ended, needs a scenario walkthrough, or cannot be expressed as discrete choices.


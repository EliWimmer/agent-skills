---
name: fix-with-docs
description: Fixes user-provided bugs or issues using the project's documented domain language, plans, ADRs, and research — the same docs/context layout as grill-with-docs. Grills one question at a time only when terminology, scope, or doc/code contradictions block a correct fix. Use when the user invokes /fix-with-docs, reports a bug, asks to fix broken behavior, or wants a doc-aware fix without a full planning session.
---

Fix the user-provided issue(s). Load project documentation first, align with canonical domain language, implement a focused fix, and grill only when ambiguity or contradictions would otherwise produce the wrong outcome.

If the user did not describe what to fix, ask one targeted question — do not open a full grill session yet.

## Read docs first

Before changing production code, discover and read docs that govern the issue area. Do not re-derive vocabulary or decisions already recorded under `docs/`.

```
docs/
├── context/                    ← domain language
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

1. **Check** whether `docs/` exists; list `plans/`, `context/`, `adr/`, `research/` when present.
2. **Bind the issue** to artifacts: user-named paths → read in full; feature/area named → search `docs/plans/` and `docs/research/`; otherwise read context glossaries when they exist.
3. **Context glossary:** follow **Choosing the active glossary** below.
4. **Plans in flight:** when a plan applies, read the full plan and matching `docs/plans/progress/<slug>-progress.md`.
5. **ADRs and research:** read linked or topic-relevant files before architectural or terminology-sensitive fixes.

Read entire plan and progress files — do not skim. Use canonical terms from glossaries; do not contradict accepted ADRs without calling out the conflict.

**Legacy:** repo-root or nested `CONTEXT.md` outside `docs/context/` may still exist — read as fallback; prefer `docs/context/` when present.

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

**Top-level `docs/context/CONTEXT.md`:** cross-cutting terms that span multiple bounded contexts or have no single owner (e.g. shared nouns the whole product uses).

**Sub-context files:** `docs/context/<subdir>/<slug>.md` — one cohesive glossary cluster per file. Subdirectories are semantic bounded-context names (kebab-case), not mirrors of `src/`.

Create files lazily — only when you have something to write. If `docs/context/` does not exist, create it when the first term is resolved. If no `docs/adr/` exists, create it when the first ADR is needed.

### Legacy context files

If the repo still uses the old layout (repo-root `CONTEXT.md`, nested `CONTEXT.md` under `src/`, etc.), read them as fallback but recommend [context-cleanup](../context-cleanup/SKILL.md) to migrate.

### Choosing the active glossary

**At session start:**

1. Read `docs/context/CONTEXT-MAP.md` if it exists
2. Infer the bounded context from the user's issue, code paths, or feature area
3. If a matching sub-context file exists → use it as the **active glossary**
4. If unclear → ask one targeted question
5. If no map and no sub-contexts → use `docs/context/CONTEXT.md`
6. If `docs/context/` does not exist but a legacy root `CONTEXT.md` does → read the legacy file

**During the session (writes):**

- New terms go into the **active glossary**
- Cross-cutting terms go into `docs/context/CONTEXT.md`
- When a cluster of related terms clearly belongs in a separate bounded context → **mid-session split**: create `docs/context/<subdir>/<slug>.md`, add an entry to `CONTEXT-MAP.md`, move terms there, add `## Related` links, continue in the new file

**Cross-cutting vs sub-context:** cross-cutting terms appear without a single owner; sub-context terms only make sense inside one feature area.

**Conflict check:** scan top-level `docs/context/CONTEXT.md` and the active sub-context before adding a term — challenge duplicates and contradictions across files.

## Workflow

1. **Load context** — read governing docs; explore the codebase around the issue. If a question can be answered by exploring the codebase, explore instead of asking.
2. **Diagnose** — root cause using canonical glossary terms; cross-reference code against docs and plans.
3. **Fix** — minimal focused diff; match existing project patterns; respect plan phase scope when a plan applies.
4. **Record** — update the active glossary inline when terminology is resolved; update `docs/plans/progress/` when executing under a plan; offer ADRs only per rules below.

Prefer citing doc paths in replies and commits instead of duplicating long excerpts.

## When to grill

Default to fixing. Switch to a **grill** — one question at a time, with a recommended answer each, waiting for feedback before continuing — only when:

- A glossary term conflict blocks the correct fix
- User intent is ambiguous for edge cases the fix must handle
- Code and docs contradict each other and authority is unclear
- The fix would violate an accepted ADR without explicit user direction

**Do not grill** when the issue is fully specified, the plan/progress docs answer scope questions, or exploration alone resolves ambiguity.

During a grill, apply the same techniques as [grill-with-docs](../grill-with-docs/SKILL.md): challenge against the glossary, sharpen fuzzy language, stress-test with concrete scenarios, cross-reference with code.

When the **AskQuestion** tool is available, use it for grilling — one question per call, concrete options with your recommended answer labeled, context in the prompt; wait for the answer before continuing. Fall back to chat for open-ended questions. See **AskQuestion tool** in [grill-with-docs](../grill-with-docs/SKILL.md).

## During and after the fix

### Challenge against the glossary

When the user uses a term that conflicts with existing language in the active glossary (or top-level `CONTEXT.md`), call it out immediately.

### Sharpen fuzzy language

When vague or overloaded terms block a precise fix, propose a canonical term before implementing.

### Cross-reference with code

When docs or the user state how something should work, verify the code agrees. Surface contradictions before shipping a fix that encodes the wrong model.

### Update the active glossary inline

When a term is resolved during the fix, update the active glossary right there. Use the format in [CONTEXT-FORMAT.md](../grill-with-docs/CONTEXT-FORMAT.md).

Context files are glossaries only — no implementation details, specs, or scratch notes.

### Offer ADRs sparingly

Only offer to create an ADR when all three are true:

1. **Hard to reverse** — the cost of changing your mind later is meaningful
2. **Surprising without context** — a future reader will wonder "why did they do it this way?"
3. **The result of a real trade-off** — there were genuine alternatives and you picked one for specific reasons

If any of the three is missing, skip the ADR. Use the format in [ADR-FORMAT.md](../grill-with-docs/ADR-FORMAT.md).

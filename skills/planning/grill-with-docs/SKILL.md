---
name: grill-with-docs
description: Grilling session that challenges your plan against the existing domain model, sharpens terminology, and updates documentation (docs/context glossaries, ADRs) inline as decisions crystallise. Use when user wants to stress-test a plan against their project's language and documented decisions.
---

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time, waiting for feedback on each question before continuing.

If a question can be answered by exploring the codebase, explore the codebase instead.

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
2. Infer the bounded context from the user's plan, code paths, or feature area
3. If a matching sub-context file exists → use it as the **active glossary**
4. If unclear → ask one targeted question
5. If no map and no sub-contexts → use `docs/context/CONTEXT.md`
6. If `docs/context/` does not exist but a legacy root `CONTEXT.md` does → read the legacy file

**During the session (writes):**

- New terms go into the **active glossary**
- Cross-cutting terms go into `docs/context/CONTEXT.md`
- When a cluster of related terms clearly belongs in a separate bounded context → **mid-grill split**: create `docs/context/<subdir>/<slug>.md`, add an entry to `CONTEXT-MAP.md`, move terms there, add `## Related` links, continue in the new file

**Cross-cutting vs sub-context:** cross-cutting terms appear without a single owner; sub-context terms only make sense inside one feature area.

**Conflict check:** scan top-level `docs/context/CONTEXT.md` and the active sub-context before adding a term — challenge duplicates and contradictions across files.

## During the session

### Challenge against the glossary

When the user uses a term that conflicts with existing language in the active glossary (or top-level `CONTEXT.md`), call it out immediately. "Your glossary defines 'cancellation' as X, but you seem to mean Y — which is it?"

### Sharpen fuzzy language

When the user uses vague or overloaded terms, propose a precise canonical term. "You're saying 'account' — do you mean the Customer or the User? Those are different things."

### Discuss concrete scenarios

When domain relationships are being discussed, stress-test them with specific scenarios. Invent scenarios that probe edge cases and force the user to be precise about the boundaries between concepts.

### Cross-reference with code

When the user states how something works, check whether the code agrees. If you find a contradiction, surface it: "Your code cancels entire Orders, but you just said partial cancellation is possible — which is right?"

### Update the active glossary inline

When a term is resolved, update the active glossary right there. Don't batch these up — capture them as they happen. Use the format in [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md).

Context files are glossaries only — no implementation details, specs, or scratch notes.

### Offer ADRs sparingly

Only offer to create an ADR when all three are true:

1. **Hard to reverse** — the cost of changing your mind later is meaningful
2. **Surprising without context** — a future reader will wonder "why did they do it this way?"
3. **The result of a real trade-off** — there were genuine alternatives and you picked one for specific reasons

If any of the three is missing, skip the ADR. Use the format in [ADR-FORMAT.md](./ADR-FORMAT.md).

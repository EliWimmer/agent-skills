---
name: context-cleanup
description: Migrates monolithic or scattered CONTEXT.md files into docs/context/ layout. Use when invoked explicitly (/context-cleanup), when a repo has a root or nested CONTEXT.md outside docs/context/, or when grill-with-docs recommends consolidating an oversized glossary.
---

Reorganize legacy context documentation into the `docs/context/` layout used by [grill-with-docs](../grill-with-docs/SKILL.md). This skill moves and splits existing content — it does not invent domain definitions.

## Target layout

```
docs/context/
├── CONTEXT.md              ← cross-cutting terms only
├── CONTEXT-MAP.md          ← when multiple bounded contexts exist
├── <bounded-context>/
│   └── <slug>.md
└── ...
```

See [CONTEXT-FORMAT.md](../grill-with-docs/CONTEXT-FORMAT.md) for glossary structure, naming, and cross-linking rules.

## Legacy locations to find

- Repo-root `CONTEXT.md`
- Repo-root `CONTEXT-MAP.md` pointing at old paths
- Any `CONTEXT.md` nested under `src/`, `packages/`, or similar
- An existing partial `docs/context/` tree (merge, don't overwrite blindly)

## Workflow

1. **Inventory** — locate all legacy context files; read any existing `docs/context/` content
2. **Propose a split** — present a mapping: source file → target path(s), which terms stay in top-level `CONTEXT.md` vs move to sub-contexts, suggested `CONTEXT-MAP.md` entries, and obvious ADR cross-links
3. **Wait for approval** — do not move or delete until the user confirms the split
4. **Migrate** — create or update files under `docs/context/`; add `## Related` links where non-obvious
5. **Delete legacy files** — remove old root and nested `CONTEXT.md` files after migration
6. **Fix in-repo links** — update any references that pointed at old paths
7. **Summarize** — list what moved where in your response (or commit/PR description); do not create a separate migration doc

## Split heuristics

- **Top-level `CONTEXT.md`:** terms used across multiple feature areas or with no single owner
- **Sub-context subdirectory:** genuine bounded context (separate vocabulary owner)
- **Slug file:** one cohesive cluster of related terms; split further when a file exceeds ~80 lines or covers two clearly distinct sub-areas
- **Subdirectory names:** kebab-case semantic domain names, not `src/` path mirrors

## What not to do

- Do not invent or rewrite domain definitions — only reorganize existing content
- Do not run without explicit user invocation
- Do not touch ADRs except adding optional "See also" links when a context file clearly corresponds to an existing ADR
- Do not leave legacy stub files unless the user explicitly asks for redirects

## After cleanup

Recommend a [grill-with-docs](../grill-with-docs/SKILL.md) session for any terms flagged as ambiguous during the split, rather than resolving them during cleanup.

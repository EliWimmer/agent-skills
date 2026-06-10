---
name: planning-docs
description: Reads project planning and domain docs under docs/ before implementing or changing code. Use at the start of any coding, refactor, bugfix, or feature task when docs/plans, docs/context, docs/adr, or docs/research exist, or when the user mentions a plan, progress file, ADR, glossary, or research doc.
---

# Planning docs

Repos that use the planning skills accumulate artifacts under `docs/`. **Before writing or changing production code**, discover and read the docs that apply to the current task. Do not re-derive decisions, vocabulary, or phased scope that are already recorded here.

## Layout

```
docs/
├── context/                    ← domain language (grill-with-docs, context-cleanup)
│   ├── CONTEXT.md              ← cross-cutting terms only
│   ├── CONTEXT-MAP.md          ← index when multiple bounded contexts exist
│   └── <bounded-context>/
│       └── <slug>.md           ← one glossary cluster per file
├── adr/                        ← irreversible decisions (grill-with-docs)
│   └── NNNN-slug.md
├── plans/                      ← phased implementation plans (exploration-phased-plan)
│   ├── <slug>.md
│   └── progress/
│       └── <slug>-progress.md  ← status & notes per phase (implement-plan updates this)
└── research/                   ← dated investigations (research-and-document)
    └── YYYY_MM_DD-<slug>.md
```

**Legacy:** repo-root or nested `CONTEXT.md` outside `docs/context/` may still exist — read as fallback; prefer `docs/context/` when present.

## What each area is for

| Path | Purpose | Written by |
|------|---------|------------|
| `docs/context/` | Canonical domain terms, aliases to avoid, relationships | grill-with-docs; reorganized by context-cleanup |
| `docs/adr/` | Durable “why we chose X” decisions | grill-with-docs (sparingly) |
| `docs/plans/<slug>.md` | Phased scope, tasks, verification per phase | exploration-phased-plan |
| `docs/plans/progress/<slug>-progress.md` | Per-phase status, decisions, notes during implementation | implement-plan (do not use the plan file for completion status) |
| `docs/research/` | Evidence-based deep dives, optional decision tables | research-and-document |

Handoff documents (handoff skill) are ephemeral temp files — follow their paths to real artifacts above; do not treat them as source of truth.

## Mandatory read pass (before code)

1. **Check** whether `docs/` exists and list `docs/plans/`, `docs/context/`, `docs/adr/`, `docs/research/` when present.
2. **Bind the task** to artifacts:
   - User named paths → read those files **in full**.
   - Feature or area named → search filenames and headings under `docs/plans/` and `docs/research/`; read the best match(es) in full.
   - No explicit doc → still read `docs/context/CONTEXT-MAP.md` or `docs/context/CONTEXT.md` when context docs exist.
3. **Context glossary:** If `CONTEXT-MAP.md` exists, open the sub-context that matches the feature area; otherwise read `docs/context/CONTEXT.md`. Scan top-level `CONTEXT.md` for terms that span contexts.
4. **Plans in flight:** If a plan applies, read the **entire** plan and its matching `docs/plans/progress/<slug>-progress.md` (same slug). Respect the user’s phase scope but keep full-document context.
5. **ADRs:** Read ADRs linked from the plan, progress file, context `## Related`, or research `## References`; skim `docs/adr/` titles when the task touches architecture or past trade-offs.
6. **Research:** Read dated files under `docs/research/` when the task overlaps their topic or the user is continuing prior investigation.

Read **entire files** for plan and progress docs — do not skim. For glossaries and long research docs, read the sections that govern the current task; read the full glossary when terminology is central.

## How to use what you read

- **Align language** with `docs/context/` — use canonical terms; do not introduce synonyms flagged as “avoid”.
- **Follow the plan** for scope, phase boundaries, and verification; if the plan conflicts with the codebase, surface it before large changes.
- **Update progress, not the plan** when executing via implement-plan unless the user asks to edit the plan.
- **Prefer citations** in replies and commits: reference paths (e.g. `docs/plans/oauth-device-flow.md`, `docs/adr/0002-postgres-for-write-model.md`) instead of duplicating long excerpts.
- **Do not contradict** accepted ADRs or glossaries without calling out the conflict and asking how to proceed.

## When docs are missing

If `docs/` is absent or empty for the task area, proceed from the codebase and user message. Do not invent `docs/` structure unless another planning skill is explicitly invoked.

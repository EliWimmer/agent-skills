---
name: implement-with-docs
description: Implements a phased plan from docs/plans by running one subagent per phase in sequence, inferring the matching progress file and grounding work in docs/context, ADRs, and research. Use when the user invokes /implement-with-docs, asks to execute or implement a plan, or provides a plan path without a separate progress path.
argument-hint: "Path to plan file under docs/plans"
disable-model-invocation: true
---

# Implement with docs

Execute a written plan under `docs/plans/`. Load governing docs first, infer the matching progress file, then **spawn one subagent per phase in sequence**. Each subagent implements its phase and updates only that phase's section in the progress file.

**Input:** plan path only (absolute or repo-relative). Do not ask for a progress path — infer it. Do not ask which phase — run all incomplete phases in order unless the user names a single phase to run.

## Asking the user

Ask **one question at a time**. Use the **AskQuestion** tool when it is available; follow [ASK-QUESTION.md](../_shared_references/ASK-QUESTION.md). Fall back to chat for open-ended questions.

**Clarifying questions** — before spawning subagents, ask when the plan path is missing or plan/code/ADR conflicts block work and need a user choice on how to proceed. Do not open a full grill for a single missing input.

See **When to grill** below for extended Q&A when ambiguity blocks correct implementation.

## Infer the progress file

From the plan path, derive `<slug>` from the filename (without `.md`):

| Plan path | Progress path |
|-----------|---------------|
| `docs/plans/<slug>.md` | `docs/plans/progress/<slug>-progress.md` |
| `docs/plans/<slug>-v2.md` | `docs/plans/progress/<slug>-v2-progress.md` |

1. If the inferred progress file exists → use it.
2. If missing → search `docs/plans/progress/` for `<slug>-progress.md` or close variants; prefer exact slug match.
3. If still missing → create `docs/plans/progress/<slug>-progress.md` with one `##` header per plan phase (matching plan headings) and the scaffold from [plan-with-docs](../plan-with-docs/SKILL.md) before spawning subagents.

## Read docs first

Before spawning subagents, discover and read docs that govern the plan area. Do not re-derive vocabulary or decisions already recorded under `docs/`.

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
├── research/
│   └── YYYY_MM_DD-<slug>.md
└── audits/
    └── YYYY_MM_DD-<slug>.md
```

1. Read the **entire** plan file and **entire** progress file — do not skim.
2. Read artifacts linked from the plan **References**, phase **Dependencies**, and progress **Decisions**.
3. Context glossary: follow **Choosing the active glossary** in [DOMAIN-AWARENESS.md](../_shared_references/DOMAIN-AWARENESS.md).
4. Respect accepted ADRs and canonical terms; surface conflicts before implementation.

**Legacy:** repo-root or nested `CONTEXT.md` outside `docs/context/` may still exist — read as fallback; prefer `docs/context/` when present.

## Domain awareness

See [DOMAIN-AWARENESS.md](../_shared_references/DOMAIN-AWARENESS.md).

## Parse phases

Extract ordered phases from the plan — headings matching `## Phase <n> — <title>` (or the project's equivalent phase pattern if consistent with nearby plans).

- **No phase headings** — treat the whole plan as a single phase named `Implementation`; ensure the progress file has a matching section.
- **User named one phase** — run only that phase's subagent; still read the full plan and progress for context.
- **Skip completed phases** — when progress shows `**Status:** Complete` (or equivalent) for a phase, skip it unless the user asked to re-run it.

## Orchestration (parent agent)

You coordinate; subagents implement. **Do not implement phase work yourself** except creating a missing progress scaffold or unblocking between phases.

### Before the first subagent

1. Confirm plan path and inferred progress path; tell the user both paths.
2. List phases to run (skip completed unless re-run requested).
3. If plan contradicts codebase or ADRs in a way that blocks work, stop and resolve with the user before spawning (use **AskQuestion** when available).

### Per phase (sequential — wait for each to finish)

Launch **one** subagent per phase using the **Task** tool (`subagent_type: generalPurpose`, `run_in_background: false`). **Never** launch the next phase until the current subagent completes successfully or reports a blocker.

Pass a self-contained prompt including:

- Plan path and progress path (full repo-relative paths)
- Exact phase heading (e.g. `## Phase 2 — Data layer`)
- Paths to governing docs the subagent must read (from your read pass: active glossary, linked ADRs, research)
- Instruction to read the full plan and progress file before coding
- Phase scope only — do not implement later phases
- Match existing project patterns; minimal focused diff
- Run the phase **Verification** steps from the plan
- **Update the progress file** for this phase only:
  - Set `**Status:**` to `Complete` or `Blocked` (with reason)
  - Fill **Progress notes** — what changed, key files, test results
  - Fill **Follow-ups** — deferred items or prerequisites for later phases
  - Add **Decisions** bullets or ADR links when the phase records new choices
- **Do not** edit the plan file for completion status unless the user explicitly asked
- Return a short summary: status, files touched, blockers, verification outcome

### After each subagent

1. Verify the progress file was updated for that phase.
2. If **Blocked**, stop the sequence and report to the user — do not start later phases that depend on it.
3. If **Complete**, proceed to the next phase.

### After all phases

Reply with: progress file path, per-phase status table, key changes, and remaining follow-ups.

## When to grill

Default to implementing. Switch to a **grill** — one question at a time, with a recommended answer each — only when:

- A glossary term conflict blocks correct implementation
- Plan scope is ambiguous for edge cases a phase must handle
- Code and docs contradict each other and authority is unclear
- A phase would violate an accepted ADR without explicit user direction

Do not grill when the plan and progress files already bound the scope.

During a grill, apply [grill-with-docs](../grill-with-docs/SKILL.md). Use **AskQuestion** for every grill question when the tool is available — see [ASK-QUESTION.md](../_shared_references/ASK-QUESTION.md).

## Quality bar

- Subagents should leave the progress file scannable — minimal prose, concrete notes.
- Each phase diff should be focused on that phase's scope and verification.
- Use canonical glossary terms in progress notes and commits.
- Prefer citing doc paths in progress **Decisions** and **Progress notes** instead of duplicating long excerpts.

## Examples

**User:** `/implement-with-docs docs/plans/reports-csv-export.md`  
**Agent:** Infer `docs/plans/progress/reports-csv-export-progress.md` → read plan, progress, and governing docs → spawn subagent for Phase 1 → wait → spawn subagent for Phase 2 → … → summarize.

**User:** `implement-with-docs docs/plans/feature-x.md phase 2 only`  
**Agent:** Same read pass → spawn one subagent for Phase 2 only → update that phase section in progress.

**User:** Plan has no phase headings — single checklist doc.  
**Agent:** Infer progress path → one subagent for the whole plan scope → update the single progress section.

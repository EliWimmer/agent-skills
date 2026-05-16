---
name: implement-plan
description: Executes work from a written plan file after a short planning pass, then records outcomes in an ADR or progress file. Use when the user invokes /implement-plan, attaches this skill, or provides a plan path, ADR/progress path, and optional phase to implement.
disable-model-invocation: true
---
# Implement plan

## Inputs (required)

1. **Plan path** — absolute or repo-relative path to the plan markdown (or other doc) that describes the work.
2. **Phase** — if the plan is split into numbered or named phases, the user supplies which phase to execute (e.g. `2`, `Phase 2`, `2 — Data layer`). If the plan has no phases, omit this and execute the whole plan or the section the user points to.
3. **ADR / progress file** — absolute or repo-relative path to the document that tracks implementation progress, decisions, and status (e.g. an ADR, `PROGRESS.md`, or a running changelog for the effort). The agent **updates this file** when work completes;.

If **plan path** or **ADR / progress file** is missing, or **phase** is required by the user’s phrasing but omitted, ask once for the missing inputs before proceeding.

## Read everything first

Before **Plan mode** discussion, **any** implementation, or updating the progress file, read the **entire** plan file and the **entire** ADR/progress file. Do not skim or rely on partial reads. After that full pass, if a **phase** was given, focus execution and the planning summary on that phase while still respecting the full context of both documents.

## Order of operations

### 1. Plan mode first

Before writing or changing production code, **switch to Plan mode** and stay there until the approach is clear:

- With full context from the plan and ADR/progress files, summarize intended changes, files likely touched, risks, and acceptance checks aligned with the plan (and phase scope when applicable).
- Resolve ambiguities with the user if the plan contradicts the codebase, the ADR/progress notes, or itself.

After the user is aligned (or Plan mode is exited with a clear go-ahead), proceed to implementation in Agent mode as needed.

### 2. Implement

- Follow the plan for the requested scope (single phase or full doc).
- Match existing project patterns; keep the diff focused on the plan.

### 3. Update the ADR / progress file when done

Edit the **ADR / progress file** (not the plan) so it stays the running record of what happened:

- Mark completed steps or phase items as done (e.g. checkboxes `- [x]`, or a **Status** line per phase).
- Brief **Notes** under the phase or at the end: what changed, key files, follow-ups, or deferred items.
- If work continues later, indicate **Next** (next phase number/name or remaining bullets).
- If the project uses ADR-style entries, add or update entries as appropriate without duplicating the whole plan.

Do not replace the progress/ADR file with unrelated prose; minimal, scannable updates preferred. **Do not** edit the plan file for completion status unless the user explicitly asks you to.

## Examples

**User:** `/implement-plan docs/plans/feature-x.md phase 1 docs/adr/feature-x-progress.md`\
**Agent:** Read `feature-x.md` and `feature-x-progress.md` in full → Plan mode → implement phase 1 → update the ADR/progress file (phase 1 checked, notes).

**User:** Plan is a single checklist with no phases — plan and ADR paths only.\
**Agent:** Read both files in full → Plan mode → whole scope → implement → check off completed items in the **ADR / progress file** only.

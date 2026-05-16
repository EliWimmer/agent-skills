---
name: exploration-phased-plan
description: Performs deep codebase exploration and produces a detailed phased implementation plan plus a matching ADR progress scaffold. Use when the user invokes exploration/phased planning, attaches this skill, or asks for a phased plan with docs under docs/plans and docs/adr for a specific feature or request.
disable-model-invocation: true
---

# Exploration and phased plan

## Goal

For the **feature or request** the user states with this invocation (same message or clearly referenced):

1. **Explore the current project deeply** until you understand how the change fits architecture, conventions, and existing code paths.
2. **Write a detailed phased plan** as a markdown file under `./docs/plans` (create the directory if it does not exist).
3. **Create an accompanying ADR progress** markdown file under `./docs/adr` (create the directory if it does not exist), with a **top-level header (`##`) for each phase** from the plan, ready for decisions and status as work proceeds.

Optional handoff: the plan and ADR paths can later be fed to the **implement-plan** skill as the plan file and progress file.

## Deep exploration (do this before writing)

Use tools (search, file reads, dependency/config inspection) as needed. Aim for **grounded** plans—every major step should map to files, modules, or patterns you actually saw.

Cover as applicable:

- **Layout and entrypoints** — apps, packages, main modules, routing, CLI.
- **Domain and data** — models, persistence, APIs, external integrations.
- **Conventions** — naming, error handling, testing layout, build/lint/format.
- **Related code** — existing features that will be extended, duplicated, or replaced.
- **Risks and unknowns** — legacy areas, missing tests, platform constraints.

If the repo is large, prioritize breadth where it affects the request, then depth on the hot path. Note explicit **assumptions** only when the codebase cannot answer something; keep them short.

## Outputs

### 1. Plan file — `./docs/plans/<slug>.md`

- **`<slug>`** — short kebab-case name derived from the feature/request (e.g. `oauth-device-flow`). If `./docs/plans/<slug>.md` already exists, use a suffix such as `<slug>-v2` or a date fragment, and mention the collision in the response.
- **Content** — markdown with at minimum:
  - **Context** — what you learned from exploration that matters for this work (concise, cite important paths or components when helpful).
  - **Objective** — what “done” means for the user’s request.
  - **Constraints** — technical, product, or compatibility constraints inferred from the project.
  - **Phased plan** — ordered phases (`## Phase 1 — …`, `## Phase 2 — …`, …). Each phase must include:
    - **Scope** — in/out.
    - **Tasks** — concrete, checkable bullets (nested lists allowed).
    - **Deliverables** — artifacts, endpoints, UI, migrations, etc.
    - **Verification** — how to confirm the phase (tests, manual steps, metrics).
    - **Dependencies** — prior phases or external prerequisites.
  - **Risks and mitigations** — optional but recommended for non-trivial work.
  - **Open questions** — numbered list for the user if anything must be decided before implementation.

Phases should be **sequenced for implementation** (dependencies first, vertical slices when useful).

### 2. ADR progress file — `./docs/adr/<slug>-progress.md`

- Use the **same `<slug>`** as the plan file (same collision rules if the ADR file exists).
- **One `##` header per plan phase**, in the same order and with **matching titles** to the plan’s phase headings (same phase number and short title).
- Under each phase header, include a compact scaffold the implementer can fill in, for example:

```markdown
## Phase 1 — [same title as in plan]

**Status:** Not started

### Decisions

- (ADR-style bullets or links to full ADRs when created)

### Progress notes

-

### Follow-ups

-
```

Adjust labels (`Status`, `Decisions`, etc.) if the project already uses a different ADR/progress pattern—**stay consistent with nearby docs** in `./docs/adr` when any exist.

At the top of the file, a single `#` title line summarizing the effort (e.g. `# ADR / progress — <slug>`) is recommended.

## Execution order

1. Confirm the **feature or request** from the user message; if ambiguous, ask one clarifying question before exploring further.
2. Run **deep exploration** (this section is blocking for quality).
3. Ensure `./docs/plans` and `./docs/adr` exist (`mkdir -p` or equivalent if missing).
4. Write **both** markdown files in one pass when possible so phase headers stay aligned.
5. In the chat reply, give **full paths** to both files and a **two- or three-sentence** summary of the approach; do not paste the entire plan unless the user asks.

## Quality bar

- Plans should be **actionable** by another agent or developer without re-deriving architecture from scratch.
- Phases should be **right-sized** — neither one vague mega-phase nor dozens of one-line phases unless the work truly requires it.
- Keep the plan **under ~400 lines** when possible; link or reference deep dives instead of duplicating entire files.

## Examples

**User:** “Add CSV export to the reports screen” + this skill attached.\
**Agent:** Explore reporting UI, data sources, and export patterns → write `docs/plans/reports-csv-export.md` and `docs/adr/reports-csv-export-progress.md` with `##` headers per phase.

**User:** Same slug already in `docs/plans`.\
**Agent:** Write `docs/plans/reports-csv-export-v2.md` and `docs/adr/reports-csv-export-v2-progress.md`, note the collision in the reply.

---
name: plan-with-docs
description: Explores the codebase and produces a phased implementation plan plus matching progress scaffold under docs/plans, grounded in docs/context glossaries, ADRs, plans, and research. Use when the user invokes /plan-with-docs, asks for a doc-aware phased plan, or wants exploration and planning aligned with project domain language.
disable-model-invocation: true
argument-hint: "Feature or request to plan"
---

# Plan with docs

For the **feature or request** the user states with this invocation (same message or clearly referenced): load governing docs first, explore the project deeply, align with canonical domain language, and write a phased plan plus matching progress scaffold under `docs/plans/`. Cross-link from `docs/context/CONTEXT-MAP.md` and any applicable context, ADR, plan, or research files.

Optional handoff: the plan path can later be fed to the **implement-with-docs** skill (progress path is inferred).

## Asking the user

Ask **one question at a time**. Use the **AskQuestion** tool when it is available; follow [ASK-QUESTION.md](../_shared_references/ASK-QUESTION.md). Fall back to chat for open-ended questions.

**Clarifying questions** — before exploring or writing the plan, ask when the feature or request is missing or ambiguous (scope, depth, or which bounded context applies). Do not open a full grill for a single missing input.

See **When to grill** below for extended Q&A when ambiguity blocks correct phase scoping.

## Read docs first

Before exploring or writing, discover and read docs that govern the planning area. Do not re-derive vocabulary or decisions already recorded under `docs/`.

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

1. Check whether `docs/` exists; list `plans/`, `context/`, `adr/`, `research/`, and `audits/` when present.
2. Bind the request to artifacts:
   - User-named paths → read in full.
   - Feature or area named → search `docs/plans/`, `docs/research/`, and `docs/audits/` for overlapping work; read the best match(es) in full.
   - No explicit doc → still read context glossaries when they exist.
3. Context glossary: follow **Choosing the active glossary** in [DOMAIN-AWARENESS.md](../_shared_references/DOMAIN-AWARENESS.md).
4. Plans in flight: when a related plan exists, read the full plan and matching progress file — extend, supersede, or reference it explicitly; do not silently duplicate phased work.
5. ADRs and research: read linked or topic-relevant files before architectural or terminology-sensitive planning.
6. Audits: when a prior audit covers the area, read it and address listed gaps or open questions in the new plan where appropriate.

Read entire plan and progress files — do not skim. Use canonical terms from glossaries; do not contradict accepted ADRs without calling out the conflict in **Open questions**.

**Legacy:** repo-root or nested `CONTEXT.md` outside `docs/context/` may still exist — read as fallback; prefer `docs/context/` when present.

## Domain awareness

See [DOMAIN-AWARENESS.md](../_shared_references/DOMAIN-AWARENESS.md).

## Deep exploration (blocking)

After the doc read pass, explore the codebase until you understand how the change fits architecture, conventions, and existing code paths. Use search, file reads, dependency/config inspection, and doc review as needed.

Cover as applicable:

- **Layout and entrypoints** — apps, packages, main modules, routing, CLI.
- **Domain and data** — models, persistence, APIs, external integrations.
- **Conventions** — naming, error handling, testing layout, build/lint/format.
- **Related code** — existing features that will be extended, duplicated, or replaced.
- **Doc vs code alignment** — where implementation diverges from glossaries, ADRs, or prior plans.
- **Risks and unknowns** — legacy areas, missing tests, platform constraints, audit findings.

If the repo is large, prioritize breadth where it affects the request, then depth on the hot path. Note explicit **assumptions** only when neither docs nor codebase can answer something; keep them short.

Every major plan step should map to files, modules, or patterns you actually saw.

## Outputs

### 1. Plan file — `./docs/plans/<slug>.md`

- **`<slug>`** — short kebab-case name derived from the feature/request (e.g. `oauth-device-flow`). If `./docs/plans/<slug>.md` already exists, use a suffix such as `<slug>-v2` or a date fragment, and mention the collision in the response.
- **Content** — markdown with at minimum:
  - **Context** — what you learned from docs and exploration that matters for this work (concise; cite important paths, ADRs, or glossary terms).
  - **Objective** — what "done" means for the user's request, in canonical project language.
  - **Constraints** — technical, product, or compatibility constraints from docs, ADRs, and the codebase.
  - **Phased plan** — ordered phases (`## Phase 1 — …`, `## Phase 2 — …`, …). Each phase must include:
    - **Scope** — in/out.
    - **Tasks** — concrete, checkable bullets (nested lists allowed).
    - **Deliverables** — artifacts, endpoints, UI, migrations, etc.
    - **Verification** — how to confirm the phase (tests, manual steps, metrics).
    - **Dependencies** — prior phases, ADRs, or external prerequisites.
  - **Risks and mitigations** — optional but recommended for non-trivial work.
  - **Open questions** — numbered list for the user if anything must be decided before implementation.
  - **References** — context glossaries, ADRs, research, audits, and prior plans consulted.

Phases should be **sequenced for implementation** (dependencies first, vertical slices when useful).

### 2. Progress file — `./docs/plans/progress/<slug>-progress.md`

- Use the **same `<slug>`** as the plan file (same collision rules if the progress file exists).
- **One `##` header per plan phase**, in the same order and with **matching titles** to the plan's phase headings (same phase number and short title).
- Under each phase header, include a compact scaffold the implementer can fill in:

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

Adjust labels (`Status`, `Decisions`, etc.) if the project already uses a different progress pattern — **stay consistent with nearby docs** in `./docs/plans/progress/` when any exist.

At the top of the file, a single `#` title line summarizing the effort (e.g. `# Progress — <slug>`) is recommended.

## Cross-link the plan

After writing both files, wire them into the doc graph:

1. **`docs/context/CONTEXT-MAP.md`** — add or update a **## Plans** section with a one-line link to the new plan. If the map has no Plans section yet, create it after **Relationships** (or after **Audits** when that section exists).
2. **Relevant context glossaries** — add the plan under `## Related` in each sub-context or `CONTEXT.md` file the plan materially references (3–6 items max per file; skip if already obvious from the map).
3. **ADRs** — cite governing ADRs in **References** and phase **Dependencies**; add a brief "See also" in the ADR body linking to the plan when the link would help future readers.
4. **Prior plans and audits** — link superseded or related artifacts in **References**; note relationship in **Context** (extends, replaces, addresses findings from).
5. **Research** — link prior research in **References** when the plan implements or responds to it.

Prefer relative paths. Do not duplicate the full plan body into other files — one-line descriptions and links only.

## When to grill

Default to planning. Switch to a **grill** — one question at a time, with a recommended answer each, waiting for feedback before continuing — only when:

- A glossary term conflict blocks correct phase scoping
- User intent is ambiguous for edge cases the plan must handle
- Code and docs contradict each other and authority is unclear
- The plan would violate an accepted ADR without explicit user direction

Do not grill when docs and exploration already bound the scope.

During a grill, apply the same techniques as [grill-with-docs](../grill-with-docs/SKILL.md). Use **AskQuestion** for every grill question when the tool is available — see [ASK-QUESTION.md](../_shared_references/ASK-QUESTION.md).

## Execution order

1. Confirm the **feature or request**; if ambiguous, use **Asking the user** (clarifying question via **AskQuestion** when available).
2. **Read docs first** per the section above.
3. Run **deep exploration** (blocking).
4. Ensure `./docs/plans` and `./docs/plans/progress` exist.
5. Write **both** markdown files in one pass so phase headers stay aligned.
6. **Cross-link** — update `CONTEXT-MAP.md` and applicable context, ADR, and research references.
7. In the chat reply, give **full paths** to both files and a **two- or three-sentence** summary of the approach; do not paste the entire plan unless the user asks.

## Quality bar

- Plans should be **actionable** by another agent or developer without re-deriving architecture from scratch.
- Phases should be **right-sized** — neither one vague mega-phase nor dozens of one-line phases unless the work truly requires it.
- Use **canonical glossary terms** in objectives, tasks, and deliverables.
- Keep the plan **under ~400 lines** when possible; link or reference deep dives instead of duplicating entire files.

## Examples

**User:** `/plan-with-docs CSV export on the reports screen`  
**Agent:** Read reporting context + related ADRs → explore reporting UI and data sources → write `docs/plans/reports-csv-export.md` and `docs/plans/progress/reports-csv-export-progress.md` → link from `CONTEXT-MAP.md`.

**User:** Same slug already in `docs/plans`.  
**Agent:** Write `docs/plans/reports-csv-export-v2.md` and `docs/plans/progress/reports-csv-export-v2-progress.md`, note the collision and relationship to v1 in **Context**.

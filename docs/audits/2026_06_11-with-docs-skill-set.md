# `*-with-docs` skill-set audit

**Date:** 2026-06-11
**Scope:** In — the doc-aware planning family under `skills/planning/`: `planning-docs`, `ask-with-docs`, `grill-with-docs`, `plan-with-docs`, `fix-with-docs`, `implement-with-docs`, `audit-with-docs`, plus the shared reference files in `grill-with-docs/` (`ASK-QUESTION.md`, `CONTEXT-FORMAT.md`, `ADR-FORMAT.md`). Adjacent — legacy siblings `exploration-phased-plan`, `implement-plan`, `research-and-document`, `context-cleanup` (assessed for overlap only). Out — non-planning skills, sync/install tooling, MCP plugins.
**Posture:** Cohesive and well-written family, but suffering from copy-paste drift: a duplicated boilerplate block has diverged from each skill's own canonical layout, `docs/audits/` is unevenly adopted by consumer skills, two legacy siblings overlap the new skills without a deprecation story, and the planning doc-system vocabulary is absent from `docs/context/`.

## Summary

The seven `*-with-docs` skills share a clear, consistent design language (read-docs-first, active-glossary selection, grill-when-blocked, cross-link outputs). The dominant problem is **duplication-driven drift**: a ~50-line "Domain awareness / File structure / Choosing the active glossary" block is pasted into six skills and has already fallen out of sync — its embedded layout diagram shows only `context/` + `adr/` while the same file's authoritative "Read docs first" diagram shows the full tree. The newest artifact type, `docs/audits/`, is read by `plan`/`implement`/`audit` but **missing from `planning-docs`, `ask-with-docs`, and `fix-with-docs`** — so audit findings will not be read before the very fixes meant to address them. `plan-with-docs`/`implement-with-docs` duplicate the still-installed `exploration-phased-plan`/`implement-plan` with no canonical-vs-legacy signal, and `planning-docs` still attributes plan authorship to the legacy skill. Finally, the planning doc-system's own heavily-used vocabulary (active glossary, bounded context, progress file, phase, drift, cross-link) is undefined in `docs/context/`. The body content quality is high; the issues are structural consistency and lifecycle, not correctness.

## Findings

### `docs/audits/` not read by consumer skills — high

**Category:** drift
**Evidence:** `audit-with-docs` writes `docs/audits/` and adds an `## Audits` section to `CONTEXT-MAP.md`. But the "Read docs first" layouts omit it in `skills/planning/planning-docs/SKILL.md` (lines 12–27, read pass 45–53), `skills/planning/ask-with-docs/SKILL.md` (22–34), and `skills/planning/fix-with-docs/SKILL.md` (20–32). Only `plan-with-docs`, `implement-with-docs`, and `audit-with-docs` list `audits/`.
**Doc reference:** `audit-with-docs` "Cross-link the audit" step 1; `planning-docs` "Mandatory read pass".
**Impact:** `fix-with-docs` is the natural consumer of audit findings yet never loads them; `planning-docs` (the central read-before-code contract) never surfaces audits before coding. Audits become write-only — drift the audit was meant to catch goes unread.
**Suggested action:** Add `audits/` to the layout and read pass of `planning-docs`, `ask-with-docs`, and `fix-with-docs` (read prior audits overlapping the task area, same as `plan-with-docs` step 6).

### Duplicated domain-awareness block across six skills — high

**Category:** problem-area
**Evidence:** The "## Domain awareness → File structure → Choosing the active glossary" block is near-verbatim in `ask-with-docs` (49–101), `audit-with-docs` (69–121), `fix-with-docs` (44–96), `grill-with-docs` (16–68), `implement-with-docs` (62–109), and `plan-with-docs` (56–108). `grill-with-docs/CONTEXT-FORMAT.md` already exists as the canonical glossary-structure reference, but the skills inline a paraphrase instead of linking.
**Doc reference:** `CONTEXT-FORMAT.md`; `author-skill` body-content rule "Link large reference material as separate files… instead of bloating `SKILL.md`".
**Impact:** Six copies must be edited in lockstep for any change to glossary rules; this block is the root cause of the layout contradiction below and the `audits/` drift above. Maintenance cost scales with every new family member.
**Suggested action:** Extract the shared block to one reference file (e.g. `grill-with-docs/DOMAIN-AWARENESS.md`, alongside the other shared refs) and replace each in-skill copy with a one-line link plus only the per-skill nuance. Alternatively move all shared refs to a neutral home (see informational finding on grill coupling).

### Two contradictory layout diagrams inside each skill — medium

**Category:** drift
**Evidence:** Each consumer skill contains two trees. Example: `audit-with-docs` "Read docs first" (39–53) lists `context/ adr/ plans/ research/ audits/`, but its "Domain awareness → File structure" (77–90) lists only `context/` + `adr/`. Same split in `ask-with-docs`, `fix-with-docs`, `plan-with-docs`, `implement-with-docs`.
**Doc reference:** internal to each SKILL.md.
**Impact:** A reader following the second diagram concludes plans/research/audits are out of scope. Self-contradiction undermines the "read everything that governs the task" contract.
**Suggested action:** Resolved automatically by consolidating the duplicated block (finding above). Until then, make the second diagram match the first (or delete it and keep one canonical layout per file).

### Legacy siblings overlap new skills with no lifecycle signal — medium

**Category:** problem-area
**Evidence:** `plan-with-docs` and `exploration-phased-plan` produce the same outputs (phased plan + matching progress scaffold under `docs/plans/` + `docs/plans/progress/`). `implement-with-docs` and `implement-plan` both execute a plan and update progress. All four are in `manifest.json` (lines 12, 16, 17). Neither legacy skill is marked deprecated, and neither new skill references its predecessor.
**Doc reference:** `manifest.json`; `planning-docs` "What each area is for" table.
**Impact:** Agents and users cannot tell which skill is canonical; model-invocation may pick the older, non-doc-aware variant. Duplicate maintenance surface.
**Suggested action:** Decide canonical vs legacy. Either deprecate `exploration-phased-plan`/`implement-plan` (note in their descriptions, optionally remove from manifest) or document the intended division of labor in `planning-docs`.

### `planning-docs` read-contract is stale — medium

**Category:** drift
**Evidence:** `skills/planning/planning-docs/SKILL.md` omits `docs/audits/` from the layout (12–27), the purpose table (33–39), and the read pass (45–53). Its table attributes `docs/plans/<slug>.md` to **`exploration-phased-plan`** (line 37), not `plan-with-docs`; there is no row for `audit-with-docs` outputs.
**Doc reference:** `planning-docs` "What each area is for".
**Impact:** The single skill that defines what to read before coding points at the legacy author and hides the audits artifact — both the `audits/` drift and the legacy-overlap confusion converge here.
**Suggested action:** Add an `audits/` row (written by `audit-with-docs`), update the plans row to the canonical authoring skill, and include audits in the layout + read pass.

### Inconsistent frontmatter and structure across the family — medium

**Category:** terminology
**Evidence:** `argument-hint` present on `plan`/`implement`/`audit`, absent on `ask`/`fix`/`grill` (which also take user input). `disable-model-invocation: true` on `plan`/`implement` only. `grill-with-docs` description omits the `/grill-with-docs` invocation phrasing that `ask`/`plan`/`implement`/`audit`/`fix` all include, has no `#` H1 title, and uses an ad-hoc `### AskQuestion tool` heading instead of the family's standard `## Asking the user` section; it also lacks a "Read docs first" pass.
**Doc reference:** `author-skill` "SKILL.md frontmatter".
**Impact:** Uneven discovery and invocation behavior; `grill-with-docs` reads as an outlier despite being the family's shared foundation.
**Suggested action:** Define and apply a family convention: `argument-hint` on every skill that consumes an argument; explicit rationale for `disable-model-invocation`; give `grill-with-docs` an H1, a standard `## Asking the user` section, and a slash-invocation mention in its description.

### Planning doc-system vocabulary missing from `docs/context/` — medium

**Category:** gap
**Evidence:** Terms used pervasively across the family — *active glossary, bounded context, progress file, phase, ADR, audit, drift, cross-link, doc graph, sub-context, mid-session split* — are defined nowhere under `docs/context/`. `CONTEXT-MAP.md` lists only two contexts (Agent Skills source repo, Git commit prefixes); the planning doc-system, the repo's most intricate subsystem, has no glossary.
**Doc reference:** `docs/context/CONTEXT-MAP.md`; `audit-with-docs` "Glossary and terminology gaps" mandate.
**Impact:** By the family's own standard (terms used in code/skills but absent from glossaries are a gap), the skill-set fails to dogfood itself. New contributors infer term meanings from prose scattered across seven files.
**Suggested action:** Add `docs/context/planning-doc-system/glossary.md` defining the shared terms, register it in `CONTEXT-MAP.md`, and link the shared reference files (`CONTEXT-FORMAT.md`, `ADR-FORMAT.md`) from it.

### `research-and-document` not wired into the cross-link graph — low

**Category:** drift
**Evidence:** `audit-with-docs` and `plan-with-docs` add `## Audits` / `## Plans` sections to `CONTEXT-MAP.md` and write `## Related` back-links. `research-and-document` writes only the research file — no `CONTEXT-MAP.md` `## Research` section, no back-links — and has no "Read docs first" pass to load the active glossary/ADRs before researching.
**Doc reference:** `research-and-document` "Execution order"; `plan-with-docs` "Cross-link the plan".
**Impact:** Research outputs are discoverable only by filename; the family's otherwise-symmetric doc graph has a hole.
**Suggested action:** Add a cross-link step and a brief read-docs-first pass to `research-and-document` to match the family.

### CONTEXT-MAP section ordering is under-specified — low

**Category:** terminology
**Evidence:** `audit-with-docs` says add `## Audits` "after **Relationships**"; `plan-with-docs` says add `## Plans` "after **Relationships** (or after **Audits** when that section exists)". No skill fixes the canonical order of the optional sections.
**Doc reference:** `audit-with-docs` / `plan-with-docs` "Cross-link" steps.
**Impact:** Minor; two skills could place sections in different orders over time.
**Suggested action:** State a canonical order once (e.g. Contexts → Relationships → Plans → Audits → Research) in `CONTEXT-FORMAT.md` and reference it.

## Doc vs code drift

- **Layout diagrams** disagree with each other inside five skills (see medium finding) and with `planning-docs` across the family (audits omitted).
- **Authorship attribution**: `planning-docs` credits `exploration-phased-plan` for plans now produced by `plan-with-docs`.
- **CONTEXT-MAP coverage**: the map documents 2 contexts but the planning doc-system (7 skills + 3 shared refs) is undocumented.

## Incomplete work

- `docs/audits/` adoption is partial: created and cross-linked by `audit-with-docs`, consumed by `plan`/`implement`, but unacknowledged by `planning-docs`/`ask`/`fix`. This audit is the first file to land under `docs/audits/`.
- No deprecation decision recorded for `exploration-phased-plan` / `implement-plan` despite functional supersession.
- No `docs/adr/` exists yet; the family references ADR creation heavily but the repo records no architectural decisions (e.g. "why a doc-aware family supersedes the legacy planning skills" would qualify under `ADR-FORMAT.md` criteria).

## Glossary and terminology gaps

- Planning doc-system terms undefined in `docs/context/` (see medium finding).
- "active glossary" vs "bounded context" vs "sub-context" are used interchangeably-ish in prose; a glossary would pin the distinctions the skills already rely on.
- Shared reference files (`ASK-QUESTION.md`, `CONTEXT-FORMAT.md`, `ADR-FORMAT.md`) live under `grill-with-docs/` but are family-wide; their ownership is implicit, not documented.

## References

- `skills/planning/planning-docs/SKILL.md`
- `skills/planning/ask-with-docs/SKILL.md`
- `skills/planning/grill-with-docs/SKILL.md` + `ASK-QUESTION.md`, `CONTEXT-FORMAT.md`, `ADR-FORMAT.md`
- `skills/planning/plan-with-docs/SKILL.md`
- `skills/planning/fix-with-docs/SKILL.md`
- `skills/planning/implement-with-docs/SKILL.md`
- `skills/planning/audit-with-docs/SKILL.md`
- `skills/planning/exploration-phased-plan/SKILL.md`, `skills/planning/implement-plan/SKILL.md`, `skills/planning/research-and-document/SKILL.md`, `skills/planning/context-cleanup/SKILL.md`
- `docs/context/CONTEXT.md`, `docs/context/CONTEXT-MAP.md`, `docs/context/git/commit-prefixes.md`
- `manifest.json`; `~/.claude/skills/author-skill/SKILL.md`

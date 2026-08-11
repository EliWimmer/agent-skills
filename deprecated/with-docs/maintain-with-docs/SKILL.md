---
name: maintain-with-docs
description: Audits and cleans up a mature project's doc graph by distilling durable knowledge, correcting stale references, merging duplication, and removing irrelevant context. Use when the user invokes /maintain-with-docs, asks to refresh accumulated with-docs artifacts, prune stale project context, or perform periodic docs maintenance.
disable-model-invocation: true
argument-hint: "Project area or doc-maintenance scope"
---

# Maintain with docs

Refresh a project that has accumulated `docs/` artifacts through repeated with-docs work. Inventory the doc graph, verify it against current code and decisions, propose a safe maintenance set, then update, consolidate, cross-link, archive, or delete material so future sessions load a smaller and more trustworthy body of context. The primary output is a cleaned doc graph, not another report about it.

## Asking the user

Ask **one question at a time**. Use the **AskQuestion** tool when it is available; follow [ASK-QUESTION.md](../_shared_references/ASK-QUESTION.md). Fall back to chat for open-ended questions.

Clarify only when the answer changes what should survive the cleanup: the maintenance boundary, whether historical artifacts must remain available, or which source is authoritative when code and accepted docs disagree. Do not ask about choices that current code, Git history, or governing docs can resolve.

Before deleting an artifact, collapsing distinct terms, or rewriting an accepted decision, present the proposed action and evidence and wait for approval. Routine link repair, status correction, and removal of exact duplication do not require a separate confirmation when the user asked for cleanup.

## Read docs first

Read the complete doc graph in scope before editing it. A file that appears irrelevant in isolation may be the only record of a decision or the target of an important cross-link.

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

1. Inventory `docs/context/`, `docs/adr/`, `docs/plans/`, `docs/plans/progress/`, `docs/research/`, and `docs/audits/`. Find repo-root or nested legacy `CONTEXT.md` files and in-repo links to docs.
2. Bind the user's scope to the active glossary by following **Choosing the active glossary** in [DOMAIN-AWARENESS.md](../_shared_references/DOMAIN-AWARENESS.md).
3. Read every artifact in scope. Read linked artifacts outside the boundary when needed to understand ownership or avoid breaking the doc graph.
4. Read applicable plans and progress files together. Treat progress as execution state and plans as intended scope.
5. Read relevant ADRs, research, and prior audits before judging whether their information is obsolete or merely historical.
6. Verify claims against current code, tests, configuration, and, when necessary, focused Git history. Do not infer staleness from age alone.

**Legacy:** repo-root or nested `CONTEXT.md` outside `docs/context/` is fallback input. If the main problem is migrating scattered glossaries into the standard layout, hand off that portion to [context-cleanup](../../planning/context-cleanup/SKILL.md).

## Domain awareness

See [DOMAIN-AWARENESS.md](../_shared_references/DOMAIN-AWARENESS.md).

## Classify before changing

Build a compact maintenance ledger for the files and claims in scope. Classify each item by the action it needs:

- **Keep** — current, authoritative, appropriately placed, and useful to future work.
- **Distill** — contains durable knowledge buried in chronology, repetition, or implementation detail; move the durable part to its owning glossary, ADR, or current progress summary.
- **Update** — still belongs, but paths, names, status, behavior, or relationships are stale.
- **Merge** — duplicates another artifact or splits one concept without a real ownership boundary.
- **Archive** — historically useful but no longer governing. Prefer the repository's established archival convention; do not invent one silently.
- **Delete** — irrelevant, superseded, empty, generated, or misleading after any durable knowledge and useful history have been preserved.

For every destructive or semantic action, record the evidence, destination of anything preserved, and links that must change. Distinguish an outdated statement from an intentionally historical record.

## Source-of-truth order

Use this default authority order, while respecting explicit project conventions:

1. Accepted ADRs for durable decisions and trade-offs
2. Active glossary for canonical domain language
3. Current code, tests, and configuration for shipped behavior
4. Active plan plus matching progress file for intended and completed work
5. Research and audits for evidence at a point in time
6. Git history when present-day files do not explain why something exists

Do not silently rewrite an accepted ADR to match code. Surface the conflict and use **When to grill**. Do not promote a temporary implementation detail into a glossary merely because it appears in code.

## Maintenance workflow

1. **Bound the pass** — name the whole repository or the bounded contexts and artifact families included and excluded.
2. **Inventory the graph** — list artifacts, incoming and outgoing links, owners, and obvious orphans.
3. **Verify reality** — check referenced paths, symbols, commands, statuses, and claims against the current project.
4. **Prepare the ledger** — classify items as Keep, Distill, Update, Merge, Archive, or Delete; identify the canonical destination for preserved knowledge.
5. **Confirm consequential cleanup** — get approval for deletions, semantic merges, history removal, or decision changes.
6. **Apply edits in dependency order** — first update canonical destinations, then repair cross-links, then remove or archive superseded sources.
7. **Validate** — search for old paths and terminology, check relative links, ensure plans and progress agree, confirm CONTEXT-MAP coverage, and run repository doc checks when available.
8. **Report the result** — summarize what was distilled, updated, merged, archived, and deleted; list unresolved authority conflicts separately.

Do not create a dated audit by default: maintenance should reduce accumulated context. If the user needs an enduring assessment before cleanup, use [audit-with-docs](../audit-with-docs/SKILL.md), then keep its findings synchronized with the resulting changes.

## Editing rules

- Preserve one canonical home for each piece of durable knowledge; replace copies with links.
- Keep glossaries about language and relationships, ADRs about durable decisions, plans about intended work, progress files about execution state, research about evidence, and audits about findings.
- Summarize completed plan history in the matching progress file; do not rewrite plan scope to describe what happened.
- Remove stale references from both directions when deleting or moving a file.
- Keep `CONTEXT-MAP.md` structural: one-line entries, not artifact summaries.
- Use [CONTEXT-FORMAT.md](../_shared_references/CONTEXT-FORMAT.md) when changing glossaries or CONTEXT-MAP.
- Preserve user-authored nuance when shortening prose. If two passages disagree, resolve authority before merging them.
- Leave unrelated docs and working-tree changes untouched.

## When to grill

Default to maintaining. Switch to a grill only when:

- Two glossaries or artifacts claim ownership of the same concept
- Code, an accepted ADR, and the active glossary disagree about authority
- A deletion would erase the only rationale or historical evidence for a current constraint
- A proposed merge would collapse genuinely different bounded-context meanings
- The repository has no archival convention and the user needs historical material retained

Use [grill-with-docs](../grill-with-docs/SKILL.md) and [ASK-QUESTION.md](../_shared_references/ASK-QUESTION.md). Ask one question at a time and recommend the answer best supported by the repository.

## Cross-link maintained docs

After moving or consolidating knowledge:

1. Update `docs/context/CONTEXT-MAP.md` using the section order in [CONTEXT-FORMAT.md](../_shared_references/CONTEXT-FORMAT.md).
2. Keep relevant glossary `## Related` sections to 3–6 useful links.
3. Repair reciprocal links in ADRs, plans, research, and audits only when they help future readers.
4. Remove links to deleted artifacts and search the repository for their old paths.

Do not add maintenance-log entries to the doc graph unless the repository already has a required changelog convention.

## Quality bar

- Every deletion has an explicit reason and no unique durable knowledge was lost.
- Every current artifact has a clear owner, purpose, and discoverable path through the doc graph.
- Glossaries contain canonical language rather than implementation chronology.
- Plans and progress files agree on scope and execution state without duplicating each other.
- Accepted ADR history remains intact unless the user explicitly chose to supersede it.
- No stale path, orphan link, duplicate definition, or obsolete status found in the pass remains unaddressed or unexplained.
- The resulting docs are materially smaller, clearer, or more trustworthy—not merely reformatted.

## Examples

**User:** "/maintain-with-docs — clean up the billing docs after a year of plan and audit work"
**Agent:** Read the billing glossary, ADRs, plans + progress, research, and audits → verify claims against current billing code → propose distilling durable rules into the glossary, correcting completed phase status, merging two duplicate audits, and deleting a superseded scratch research file → get approval for merge/deletion → apply and validate all links → report the smaller authoritative graph.

**User:** "Refresh our docs; several modules were renamed and old plans keep confusing agents"
**Agent:** Inventory the scoped doc graph and renamed symbols → update current glossary paths and references → preserve decision rationale from completed plans in progress/ADRs → ask before removing the old plans → repair CONTEXT-MAP and reciprocal links → search for stale names and report unresolved conflicts.

---
name: compact-with-docs
description: Compacts project ADRs and glossaries through three subagents while preserving durable decisions, canonical language, and doc-graph integrity. Use when the user invokes /compact-with-docs, asks to shrink accumulated context, or wants terse high-signal ADR and glossary prose.
disable-model-invocation: true
argument-hint: "Repository or bounded-context scope"
---

# Compact with docs

Shrink ADR and glossary prose without changing project meaning. Read the governing doc graph, snapshot the current semantics, run separate ADR and glossary compactors, then run a third subagent to reconcile both rewrites. Output is a smaller `docs/adr/` and `docs/context/` surface, not a new report.

This workflow is narrower than [maintain-with-docs](../maintain-with-docs/SKILL.md): compaction removes low-value prose from ADRs and glossaries. It does not generally refresh plans, prune research, archive audits, or reconcile the whole project with current code.

## Asking the user

Ask **one question at a time**. Use the **AskQuestion** tool when available; follow [ASK-QUESTION.md](../_shared_references/ASK-QUESTION.md). Fall back to chat when needed.

Default to the whole repository when the user gives no narrower scope. Ask only when scope is ambiguous, a genuine authority conflict blocks safe compaction, or a requested rewrite would erase unique rationale. Invocation authorizes removal of trivial, obvious, and redundant prose; do not ask for approval for each ordinary deletion.

## Read docs first

Read the complete ADR and glossary set in scope before editing. Read the rest of the doc graph as evidence so apparent duplication is not mistaken for the only surviving statement of a decision or term.

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

1. Inventory every file under `docs/adr/` and `docs/context/` in scope. Include top-level cross-cutting context and every glossary indexed by `CONTEXT-MAP.md`.
2. Choose the active glossary using [DOMAIN-AWARENESS.md](../_shared_references/DOMAIN-AWARENESS.md), but compact every glossary in the requested boundary, not only the active one.
3. Read scoped ADRs and glossaries in full. Read linked artifacts outside the boundary when needed to understand ownership, status, supersession, or a cross-context relationship.
4. Read `docs/plans/`, `docs/plans/progress/`, `docs/research/`, and `docs/audits/` as evidence. Do not rewrite them except for link-only repairs by the reconciler.
5. Check code, tests, config, or focused Git history only when present-day authority or behavior is disputed. Age alone does not make prose disposable.

**Legacy:** repo-root or nested `CONTEXT.md` outside `docs/context/` is fallback input. If the main task is migrating scattered context files into the standard layout, use [context-cleanup](../../planning/context-cleanup/SKILL.md).

## Domain awareness

See [DOMAIN-AWARENESS.md](../_shared_references/DOMAIN-AWARENESS.md). Use [CONTEXT-FORMAT.md](../_shared_references/CONTEXT-FORMAT.md) for glossary structure and `CONTEXT-MAP.md` ordering.

## Prepare the compaction baseline

Before edits:

1. Record exact in-scope ADR and glossary paths.
2. Snapshot their current contents and relative-link inventory in memory or temporary state outside the repository.
3. Record pre-existing working-tree changes separately. Do not assume Git `HEAD` is the semantic baseline or overwrite user edits.
4. Give each subagent exact repo-relative paths and a non-overlapping edit boundary.

## Orchestration

Parent coordinates; **spawn exactly three subagents**. Spawn the first two in parallel, wait for both to finish, then spawn the third. Do not let the reconciler edit while either compactor is running.

The two writer subagents must load the `caveman` skill in full before rewriting. In the agent-skills source repo it lives at `skills/productivity/caveman/SKILL.md`; installed agents should load `$caveman`. Apply its prose rules to document edits, not to the parent session. Keep exact technical terms, paths, identifiers, code, and quoted errors. Use its Auto-Clarity Exception whenever compression could obscure a decision, constraint, ownership boundary, cardinality, warning, or ordered sequence.

### Subagent 1 — ADR compactor

Own only scoped `docs/adr/**/*.md`. It must not edit context, plans, progress, research, audits, code, or files assigned to another subagent.

Pass these instructions:

- Read all scoped ADRs, `CONTEXT-MAP.md`, the active glossary, linked ADRs, and linked evidence needed to understand status or supersession.
- Preserve each decision, non-obvious context, real trade-off, hard constraint, consequential rejected alternative, non-obvious consequence, status metadata, and supersession chain.
- Remove narration, generic best-practice explanation, code-discoverable implementation detail, restated glossary definitions, trivial alternatives, repeated rationale, and duplicated consequences.
- Replace repetition with a short link only when the canonical owner is unambiguous.
- Keep ADR paths, numbers, titles, status, and supersession links stable.
- Do not delete, merge, renumber, supersede, reverse, invent, or silently modernize a decision. Code drift does not authorize rewriting an accepted ADR.
- If ADRs conflict, supersession is unclear, or compaction would erase unique rationale, leave affected text intact and report the blocker.
- Return files changed, before/after word counts, retained decisions and rationale, removed repetition, blockers, and validation results.

### Subagent 2 — glossary compactor

Own scoped glossary files under `docs/context/**/*.md`, excluding `CONTEXT-MAP.md`. It must not edit ADRs, plans, progress, research, audits, code, or files assigned to another subagent.

Pass these instructions:

- Read `CONTEXT-MAP.md`, top-level `docs/context/CONTEXT.md` when present, every scoped glossary, linked context docs, and [CONTEXT-FORMAT.md](../_shared_references/CONTEXT-FORMAT.md).
- Build a private preservation ledger before editing: canonical term, exact spelling, aliases and `_Avoid_` names, owner, relationship direction/cardinality, lifecycle/state distinctions, resolved ambiguity, invariant, and useful related links. Do not write the ledger into project docs.
- Preserve project-specific vocabulary, exclusions, ownership boundaries, non-obvious constraints, relationships, and discoverability.
- Remove general knowledge, definitions obvious from the term alone, chronology, redundant examples, repeated behavior, and duplicated definitions owned by another glossary.
- Keep one canonical home per concept. Replace a removed duplicate with a link when readers still need the relationship.
- Preserve `## Example dialogue` per the glossary format, but reduce it to the shortest exchange that demonstrates a non-obvious boundary. If no such boundary exists, report the section as redundant rather than inventing one.
- Do not invent terms, change accepted semantics, merge distinct bounded-context meanings, or silently resolve contradictions. Leave disputed text intact and report it.
- Preserve required structure from `CONTEXT-FORMAT.md`: title, purpose, `## Language`, `## Relationships`, `## Example dialogue`, `## Flagged ambiguities`, and `## Related` where useful.
- Return files changed, concepts removed or merged, preserved aliases and relationships, unresolved conflicts, before/after word counts, and validation results.

### Subagent 3 — doc graph reconciler

Spawn only after both compactors finish. Give it the pre-compaction snapshot, link inventory, both subagent reports, and current diffs.

It must:

1. Read rewritten ADRs and glossaries, `CONTEXT-MAP.md`, and all plans, progress files, research, and audits in scope.
2. Compare pre/post semantics, not wording.
3. Restore lost durable knowledge only when no canonical surviving source retains it:
   - ADR: decision, status, scope, constraint, rationale, rejected alternative, consequence, supersession.
   - Glossary: canonical term, avoid-alias, ownership boundary, relationship/cardinality, lifecycle distinction, resolved ambiguity.
4. Detect accepted-ADR, glossary, plan, progress, and code authority conflicts. Do not adjudicate genuine conflicts silently; report a blocker for one user decision.
5. Repair `CONTEXT-MAP.md`, glossary `## Related`, and useful reciprocal links. Link to canonical owners; do not copy bodies back into multiple files.
6. Make only minimal restoration or link edits in ADRs and glossaries. In plans, progress, research, and audits, make link-only repairs; never alter scope, status, findings, or conclusions.
7. Keep restored prose consistent with the compact caveman style. Do not re-expand text merely for smoother reading.
8. Return restored claims, repaired links, unresolved conflicts, final word-count change, changed paths, and validation results.

## When to grill

Default to compacting. Switch to [grill-with-docs](../grill-with-docs/SKILL.md) only when:

- ADRs disagree and no clear supersession chain resolves authority
- An accepted ADR and active glossary conflict
- Two bounded contexts claim incompatible ownership of one term
- Removing text would erase the only surviving rationale, alias, constraint, or ambiguity resolution
- Code or an active plan appears to reverse an accepted decision without a recorded replacement

Follow [ASK-QUESTION.md](../_shared_references/ASK-QUESTION.md). Ask one question at a time and recommend the answer best supported by the repository.

## Cross-link compacted docs

The reconciler owns cross-link repair:

1. Keep `CONTEXT-MAP.md` structural and complete; do not add compaction logs.
2. Keep glossary `## Related` sections to 3–6 useful links.
3. Preserve ADR status and supersession links.
4. Remove links to deleted sections and repair moved anchors or canonical-owner links.
5. Do not create a new audit, plan, research file, or other artifact merely to record compaction.

## Validation

- Every durable pre-compaction claim survives once in a canonical owner.
- ADR IDs, filenames, titles, status, decision authority, and supersession chains remain intact.
- Canonical terms, avoid-aliases, ownership rules, relationships, cardinality, and resolved ambiguities remain intact.
- No duplicated glossary definition or copied ADR rationale remains without a clear reason.
- All real relative Markdown links resolve; illustrative inline paths are not mistaken for links.
- `CONTEXT-MAP.md` still covers every bounded context; no scoped ADR or glossary is orphaned.
- Aggregate ADR and glossary prose is materially smaller than the baseline.
- Only approved doc paths changed; all pre-existing worktree edits remain preserved.
- Run repository doc checks, `git diff --check`, and focused searches for removed paths, anchors, aliases, and canonical terms.

## Quality bar

- Compression removes low-value words, not project knowledge.
- ADRs still answer: what was decided, why this choice, what constraint or trade-off matters.
- Glossaries still define project-specific language, ownership, relationships, and ambiguity boundaries.
- Caveman-style fragments never make normative meaning unclear.
- The final doc graph is smaller, source-faithful, linked, and easier for future agents to load.

## Examples

**User:** `/compact-with-docs`  
**Agent:** Read full doc graph → snapshot ADR/glossary semantics → spawn ADR and glossary compactors in parallel with caveman prose rules → wait → spawn reconciler → validate links and semantic preservation → report size reduction and blockers.

**User:** `/compact-with-docs billing`  
**Agent:** Bound work to billing ADRs and every billing glossary indexed by CONTEXT-MAP → use adjacent plans/research/audits as read-only evidence → run three-subagent sequence → leave unrelated contexts untouched.

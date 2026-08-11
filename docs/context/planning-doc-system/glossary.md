# Planning doc-system

Vocabulary for the doc-aware planning skill family (`skills/with-docs/`) and the `docs/` artifacts they read and write.

## Language

**Active glossary**:
The single context file governing terminology for the current session — a sub-context slug under `docs/context/` or top-level `CONTEXT.md` when no sub-context matches.
_Avoid_: "current context file" without distinguishing read vs write target.

**Bounded context**:
A semantic domain area with its own glossary cluster, indexed in `CONTEXT-MAP.md` and stored under `docs/context/<bounded-context>/`.
_Avoid_: Mirroring `src/` folder names as context names.

**Sub-context**:
A kebab-case subdirectory under `docs/context/` containing one or more related glossary slug files owned by one bounded context.
_Avoid_: Using "sub-context" for the slug file itself — the file is a glossary cluster; the directory is the bounded context.

**Progress file**:
`docs/plans/progress/<slug>-progress.md` — per-phase status, decisions, and notes during implementation. Updated by implement-with-docs; not the plan file.
_Avoid_: Recording completion status in the plan file.

**Phase**:
A scoped slice of a plan (`## Phase N — title`) with tasks, deliverables, verification, and dependencies. implement-with-docs runs one subagent per incomplete phase in order.
_Avoid_: Ad-hoc phase labels that do not match progress file headers.

**Drift**:
Documented intent (glossary, plan, ADR, research) that no longer matches code, tests, or runtime behavior.
_Avoid_: Calling any doc/code difference "drift" when the doc was never authoritative.

**Cross-link**:
A one-line relative link from an artifact into `CONTEXT-MAP.md`, a glossary `## Related` section, or a reciprocal ADR/plan/audit/research reference — not a copy of the target body.
_Avoid_: Pasting audit or plan bodies into CONTEXT-MAP.

**Doc graph**:
The network of `docs/context/`, `docs/adr/`, `docs/plans/`, `docs/research/`, and `docs/audits/` files linked through CONTEXT-MAP and `## Related` sections.
_Avoid_: Orphan artifacts discoverable only by filename search.

**Audit**:
A dated review under `docs/audits/YYYY_MM_DD-<slug>.md` comparing documented intent to observed code and listing findings by severity.
_Avoid_: Using "audit" for ad-hoc chat review without a written artifact.

**With-docs category**:
`skills/with-docs/` in the agent-skills source repo — navigation grouping for doc-aware planning skills and family authoring (`author-skill-with-docs`). Install flattens to sibling skill folders in each tool destination.
_Avoid_: Expecting `with-docs/` in installed paths.

**Shared references**:
Family-wide markdown files under `skills/with-docs/_shared_references/`, copied into each skill's `references/` folder at install. Source SKILL.md files link via `../_shared_references/`; installed copies use `./references/`.
_Avoid_: Duplicating DOMAIN-AWARENESS or CONTEXT-FORMAT prose inside each SKILL.md.

**Mid-session split**:
Creating a new sub-context glossary file and CONTEXT-MAP entry when a cluster of terms clearly belongs in a separate bounded context during a grill, fix, or planning session.
_Avoid_: "Mid-grill split" as a separate concept — same operation.

**Maintenance pass**:
A bounded review and cleanup of a mature doc graph that verifies current claims, distills durable knowledge into its canonical owner, repairs stale references, and removes or archives irrelevant material.
_Avoid_: Treating maintenance as another audit artifact when the intended output is cleaner source documentation.

**Compaction pass**:
A three-subagent rewrite of ADRs and glossaries that removes trivial, obvious, and redundant prose while preserving durable decisions, canonical terms, and doc-graph links.
_Avoid_: Using compaction to change decisions, refresh the whole doc graph, or erase unique rationale.

## Relationships

- The **with-docs category** contains doc-aware workflow skills that share **shared references** and read the **doc graph** before acting; **author-skill-with-docs** documents how to add new family members
- **plan-with-docs** writes plans; **implement-with-docs** updates the matching **progress file** by **phase**
- **audit-with-docs** writes **audits**; **fix-with-docs** and **planning-docs** should read overlapping **audits** before changing code
- **compact-with-docs** performs a **compaction pass** over ADRs and glossaries; **maintain-with-docs** owns broader verification, merging, archiving, and deletion across the full graph
- **maintain-with-docs** performs a **maintenance pass** over an established **doc graph** and may update every artifact family without inventing a new artifact type
- An **active glossary** is chosen from **bounded context** entries in CONTEXT-MAP

## Related

- [author-skill-with-docs](../../../skills/with-docs/author-skill-with-docs/SKILL.md) — how to author new family skills in this repo
- [compact-with-docs](../../../skills/with-docs/compact-with-docs/SKILL.md) — compacts ADR and glossary prose through three specialized subagents
- [include-with-docs](../../../skills/with-docs/include-with-docs/SKILL.md) — primes with-docs system context for a session; base layer for the rest of the family
- [init-with-docs](../../../skills/with-docs/init-with-docs/SKILL.md) — bootstraps this docs/context structure for a repo that has none
- [maintain-with-docs](../../../skills/with-docs/maintain-with-docs/SKILL.md) — distills, refreshes, and prunes an established doc graph
- [CONTEXT-FORMAT.md](../../../skills/with-docs/_shared_references/CONTEXT-FORMAT.md) — glossary file structure and CONTEXT-MAP section order
- [ADR-0001: with-docs family](../../adr/0001-with-docs-family-and-shared-references.md)
- [`*-with-docs` skill-set audit](../../audits/2026_06_11-with-docs-skill-set.md)

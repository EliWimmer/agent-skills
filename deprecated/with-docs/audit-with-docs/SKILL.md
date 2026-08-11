---
name: audit-with-docs
description: Audits a user-provided project or system against documented domain language, plans, ADRs, and research to find gaps, issues, problem areas, and incomplete work. Writes findings to docs/audits and cross-links CONTEXT-MAP, context glossaries, ADRs, and plans. Use when the user invokes /audit-with-docs, asks for a doc-aware audit, gap analysis, health check, or completeness review.
disable-model-invocation: true
argument-hint: "Project area, system, or scope to audit"
---

# Audit with docs

Audit the project or system the user names. Load governing docs first, align with canonical domain language, compare documented intent against the codebase and runtime reality, and write a dated audit under `docs/audits/`. Cross-link the audit from `docs/context/CONTEXT-MAP.md` and any applicable context, ADR, plan, or research files.

## Asking the user

Ask **one question at a time**. Use the **AskQuestion** tool when it is available; follow [ASK-QUESTION.md](../_shared_references/ASK-QUESTION.md). Fall back to chat for open-ended questions.

**Clarifying questions** — ask when ambiguity would change what you explore or what lands in the audit. Do not open a full grill for a single missing input.

**Before auditing** — ask when needed to bound scope:

- What to audit is missing or could mean multiple bounded contexts
- Depth is unclear (quick pass vs deep audit)
- Multiple overlapping plans, audits, or systems could be the target
- The active glossary cannot be inferred from scope and code paths

**Before writing the audit doc** — ask when needed to shape the deliverable:

- Findings depend on which standard applies (shipped behavior vs plan phase vs ADR)
- Severity or posture would differ materially based on user priority (security vs completeness vs drift)
- Scope in/out should be confirmed because exploration surfaced a wider blast radius than the user named
- A prior audit overlaps and the user should choose supersede vs delta-only

Do **not** ask when docs and a reasonable default already bound scope — proceed with stated assumptions noted briefly in the audit **Scope** field.

See **When to grill** below for extended Q&A when ambiguity blocks correct findings.

## Read docs first

Before auditing, discover and read docs that govern the audit area. Do not re-derive vocabulary or decisions already recorded under `docs/`.

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
2. Bind the audit scope to artifacts:
   - User-named paths or systems → read in full; explore those areas in code.
   - Feature or area named → search `docs/plans/`, `docs/research/`, and prior `docs/audits/` for the best match, then read in full.
   - No explicit doc → still read context glossaries when they exist.
3. Context glossary: follow **Choosing the active glossary** in [DOMAIN-AWARENESS.md](../_shared_references/DOMAIN-AWARENESS.md).
4. Plans in flight: when a plan applies, read the full plan and matching progress file — audit against stated phase scope, tasks, and verification criteria.
5. ADRs and research: read linked or topic-relevant files before architectural, terminology-sensitive, or trade-off-heavy findings.
6. Prior audits: read existing audits under `docs/audits/` that overlap the scope; note what changed since then instead of duplicating stale findings.

Read entire plan and progress files — do not skim. Use canonical terms from glossaries; flag contradictions with accepted ADRs explicitly.

**Legacy:** repo-root or nested `CONTEXT.md` outside `docs/context/` may still exist — read as fallback; prefer `docs/context/` when present.

## Domain awareness

See [DOMAIN-AWARENESS.md](../_shared_references/DOMAIN-AWARENESS.md).

## Audit scope

**`<slug>`** — short kebab-case from the audit scope (e.g. `auth-session-handling`). If a file with the same date and slug exists, append a suffix (`-v2`, `-2`) and note the collision in the reply.

**Date** — use the **current calendar date** in `YYYY_MM_DD` for the filename prefix.

Cover as applicable:

- **Doc vs code drift** — plans, ADRs, glossaries, or research that no longer match implementation.
- **Incomplete work** — plan phases not started, tasks marked done but unverified, stubs, TODOs, feature flags left on, missing tests for stated verification.
- **Gaps** — undocumented behavior, missing ADRs for surprising architecture, terms used in code but absent from glossaries.
- **Problem areas** — bugs, failure modes, coupling, security or ops risks, tech-debt hotspots.
- **Boundary violations** — modules crossing documented ownership, contradictions between bounded contexts.

Ground every finding in evidence (paths, symbols, configs, doc quotes). Separate **observed facts** from **inference**. Classify severity: **critical**, **high**, **medium**, **low**, **informational**.

If the repo is large, stay breadth-first on boundaries, then depth where the audit scope lives.

## Audit document format

Write markdown at `./docs/audits/<YYYY_MM_DD>-<slug>.md` (create `./docs/audits` if missing):

```markdown
# <Title>

**Date:** YYYY-MM-DD  
**Scope:** <what was audited — in / out>  
**Posture:** <one-line overall health summary>

## Summary

<3–6 sentences: main gaps and highest-severity findings>

## Findings

### <Finding title> — <severity>

**Category:** gap | incomplete-work | drift | problem-area | terminology  
**Evidence:** <paths, symbols, doc links>  
**Doc reference:** <plan phase, ADR, glossary term, or "none documented">  
**Impact:** <what breaks or degrades if unaddressed>  
**Suggested action:** <concrete next step>

…

## Doc vs code drift

…

## Incomplete work

…

## Glossary and terminology gaps

…

## References

<context glossaries, ADRs, plans, progress files, research, prior audits consulted>
```

Omit empty sections only when they truly do not apply; say "N/A — …" briefly if useful.

Keep the doc **under ~500 lines** when possible; link to files instead of pasting large blocks.

## Cross-link the audit

After writing the audit file, wire it into the doc graph:

1. **`docs/context/CONTEXT-MAP.md`** — add or update an **## Audits** section with a one-line link to the new audit (section order per [CONTEXT-FORMAT.md](../_shared_references/CONTEXT-FORMAT.md)).
2. **Relevant context glossaries** — add the audit under `## Related` in each sub-context or `CONTEXT.md` file the audit materially references (3–6 items max per file; skip if already obvious from the map).
3. **ADRs** — when a finding challenges or depends on a recorded decision, cite the ADR in the finding and add a brief "See also" in the ADR body linking back to the audit when the link would help future readers.
4. **Plans and progress** — when findings relate to phased work, cite the plan phase and progress status; do not edit plan scope — note gaps for the implementer.
5. **Research** — link prior research in **References**; add a back-link in the research doc's references only when the audit supersedes or extends that investigation.

Prefer relative paths. Do not duplicate the full audit body into other files — one-line descriptions and links only.

## Workflow

1. **Confirm scope** — area, system, or depth (quick pass vs deep audit). Use **Asking the user** before auditing when scope is ambiguous.
2. **Load context** — read governing docs per **Read docs first**; explore the codebase and configs.
3. **Compare** — documented intent (glossaries, plans, ADRs) vs observed state (code, tests, ops, configs).
4. **Confirm deliverable** — use **Asking the user** before writing when findings need a user choice on standard, priority, or scope in/out.
5. **Write audit** — `docs/audits/<YYYY_MM_DD>-<slug>.md`.
6. **Cross-link** — update `CONTEXT-MAP.md` and applicable context, ADR, plan, and research references.
7. **Reply** — give the full audit path, severity headline, and top 3–5 actionable findings. Do not paste the full document unless asked.

## When to grill

Default to auditing. Switch to a **grill** — one question at a time, with a recommended answer each, waiting for feedback before continuing — only when:

- Audit scope is ambiguous enough that findings would differ materially
- A glossary term conflict blocks correct classification of a finding
- Code and docs contradict each other and authority for the audit is unclear
- The user must choose which standard applies (plan phase vs shipped behavior vs ADR)

Do not grill when exploration and docs already bound the scope.

During a grill, apply the same techniques as [grill-with-docs](../grill-with-docs/SKILL.md). Use **AskQuestion** for every grill question when the tool is available — see [ASK-QUESTION.md](../_shared_references/ASK-QUESTION.md).

## Quality bar

- Another agent or developer should be able to act on findings without re-deriving the same map.
- Prefer tables and bullets for comparisons; use diagrams (mermaid) only when they clarify non-obvious flow.
- Call out **contradictions** between code, docs, plans, and stated intent.
- Do not invent `docs/` structure beyond `docs/audits/` and justified cross-links unless the user asks to fix findings inline.

## Examples

**User:** `/audit-with-docs payment webhook handling`  
**Agent:** Read billing context + relevant ADRs and plan progress → explore webhook code and tests → write `docs/audits/2026_06_11-payment-webhook-handling.md` → link from `CONTEXT-MAP.md`.

**User:** "Audit the whole auth stack for incomplete plan work"  
**Agent:** Read full auth plan and progress → audit phase tasks and verification against code → findings tagged `incomplete-work` and `drift` → cross-link plan slug in References and CONTEXT-MAP.

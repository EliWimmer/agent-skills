---
name: research-with-docs
description: Performs deep research on a topic grounded in docs/context glossaries, plans, ADRs, and prior research, and writes a dated research document under docs/research. Use when the user invokes /research-with-docs, asks for a research doc, deep-dive assessment, architecture review, or investigation written to docs/research.
argument-hint: "Topic or area to research"
---

# Research with docs

For the **topic** the user states with this invocation (same message or clearly referenced): load governing docs first, research deeply, align with canonical domain language, and write a dated research document under `docs/research/`. Cross-link from `docs/context/CONTEXT-MAP.md` and any applicable context, ADR, plan, or audit files.

## Asking the user

Ask **one question at a time**. Use the **AskQuestion** tool when it is available; follow [ASK-QUESTION.md](../_shared_references/ASK-QUESTION.md). Fall back to chat for open-ended questions.

**Clarifying questions** — before researching, ask when the topic is vague or the active glossary cannot be inferred. Do not open a full grill for a single missing input.

See **When to grill** below for extended Q&A when ambiguity blocks correct research.

## Read docs first

Before researching, discover and read docs that govern the topic area. Do not re-derive vocabulary or decisions already recorded under `docs/`.

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
2. Bind the topic to artifacts: user-named paths → read in full; feature/area named → search `docs/plans/`, `docs/research/`, and `docs/audits/` for overlaps; otherwise read context glossaries when they exist.
3. Context glossary: follow **Choosing the active glossary** in [DOMAIN-AWARENESS.md](../_shared_references/DOMAIN-AWARENESS.md).
4. Plans in flight: when a related plan exists, read the full plan and matching progress file.
5. ADRs and prior research: read linked or topic-relevant files before architectural or terminology-sensitive findings.
6. Audits: read prior audits under `docs/audits/` that overlap the topic.

Read entire plan and progress files — do not skim. Use canonical terms from glossaries; flag contradictions with accepted ADRs explicitly.

**Legacy:** repo-root or nested `CONTEXT.md` outside `docs/context/` may still exist — read as fallback; prefer `docs/context/` when present.

## Domain awareness

See [DOMAIN-AWARENESS.md](../_shared_references/DOMAIN-AWARENESS.md).

## Research scope

**`<slug>`** — short kebab-case from the topic (e.g. `auth-session-refresh`). If a file with the same date and slug exists, append a suffix (`-v2`, `-2`) and note the collision in the reply.

**Date** — use the **current calendar date** in `YYYY_MM_DD` for the filename prefix.

## Deep research (blocking)

Use search, reads, dependency/config inspection, and doc review as needed. Prioritize what matters for the topic; go deep on the hot path.

Cover as applicable:

- **Architectural shape** — modules, layers, data flow, deployment boundaries.
- **Integration patterns** — APIs, events, queues, third parties, shared libraries.
- **Boundaries and scope** — what owns what; extension points; intentional limits.
- **Constraints not visible in code** — ops, compliance, SLAs, legacy contracts, env assumptions (cite source: doc, comment, config, or flag as assumption).
- **Issues, edge cases, gotchas** — failure modes, race conditions, implicit coupling, missing tests.
- **Inefficiencies** — redundant work, N+1 patterns, over-fetching, unclear abstractions, tech debt hotspots.

Ground every claim in evidence (paths, symbols, configs). Separate **observed facts** from **inference**. If the repo is large, stay breadth-first on boundaries, then depth where the topic lives.

## Research document format

Write markdown at `./docs/research/<YYYY_MM_DD>-<slug>.md` (create `./docs/research` if missing):

```markdown
# <Title>

**Date:** YYYY-MM-DD
**Topic:** <one-line scope>
**Scope:** <what was in / out of this research>

## Summary

<3–6 sentences: main findings and posture>

## Architectural shape

…

## Integration patterns

…

## Boundaries and scope

…

## Constraints (beyond the code)

…

## Issues, edge cases, and gotchas

…

## Inefficiencies and improvement opportunities

…

## References

<paths, ADRs, issues, external links consulted>
```

Omit empty sections only when they truly do not apply; say "N/A — …" briefly if useful. Keep the doc **under ~500 lines** when possible; link to files instead of pasting large blocks.

## Assessment for improvements

When the user is researching **to fix, refactor, or improve** something (explicit or implied), add:

```markdown
## Decision options

For each meaningful choice the implementer must make:

### <Decision title>

| Option | Pros | Cons |
|--------|------|------|
| A — … | … | … |
| B — … | … | … |

**Suggested path:** <option> — <one or two sentences why>
```

Include only decisions that matter; do not invent false choices.

## Cross-link the research

After writing the research file:

1. **`docs/context/CONTEXT-MAP.md`** — add or update a **## Research** section with a one-line link (after **Plans** and **Audits** when those sections exist; see [CONTEXT-FORMAT.md](../_shared_references/CONTEXT-FORMAT.md)).
2. **Relevant context glossaries** — add the research under `## Related` in each sub-context or `CONTEXT.md` file the research materially references (3–6 items max).
3. **Plans and audits** — link related artifacts in **References** when the research extends or responds to them.

Prefer relative paths. Do not duplicate the full research body into other files.

## When to grill

Default to researching. Switch to a **grill** — one question at a time, with a recommended answer each — only when a glossary term conflict, ambiguous scope, or doc/code contradiction blocks correct findings.

During a grill, apply the same techniques as [grill-with-docs](../grill-with-docs/SKILL.md). Use **AskQuestion** for every grill question when the tool is available — see [ASK-QUESTION.md](../_shared_references/ASK-QUESTION.md).

## Execution order

1. Confirm **topic** and whether the goal is **pure understanding** vs **improvement assessment**.
2. **Read docs first** per the section above.
3. Run **deep research** (blocking).
4. Ensure `./docs/research` exists.
5. Write the research file.
6. **Cross-link** — update `CONTEXT-MAP.md` and applicable context references.
7. In the chat reply: give the **full path**, a **short summary**, and point to **Decision options** if present. Do not paste the full document unless asked.

## Examples

**User:** `/research-with-docs auth token refresh`
**Agent:** Read auth context + linked ADRs → explore auth modules → write `docs/research/2026_06_11-auth-token-refresh.md` → link from `CONTEXT-MAP.md`.

**User:** Same topic, improvement-focused: "research session handling before we refactor"
**Agent:** Same exploration → include **Decision options** with a suggested path per decision.

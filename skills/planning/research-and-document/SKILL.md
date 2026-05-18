---
name: research-and-document
description: Performs deep research on a topic (especially in the codebase) and writes a dated research document under docs/research. Use when the user invokes research-and-document, asks for a research doc, deep-dive assessment, architecture review, or investigation written to docs/research.
argument-hint: "Topic or area to research"
---

# Research and document

## Goal

For the **topic** the user passes with this invocation (same message or clearly referenced):

1. **Research deeply** — codebase, configs, docs, tests, and external references when the topic requires them.
2. **Write one research document** at `./docs/research/<YYYY_MM_DD>-<slug>.md` (create `./docs/research` if missing).

Ground every claim in evidence (paths, symbols, configs). Separate **observed facts** from **inference**.

## Confirm the topic

If the argument or message is vague, ask **one** clarifying question before exploring further. Otherwise proceed.

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

If the repo is large, stay breadth-first on boundaries, then depth where the topic lives. List **assumptions** only when the codebase cannot answer something.

## Research document format

Write markdown with at minimum:

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

Omit empty sections only when they truly do not apply; say "N/A — …" briefly if useful.

Keep the doc **under ~500 lines** when possible; link to files instead of pasting large blocks.

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

Include only decisions that matter; do not invent false choices. The suggested path should align with project conventions you observed.

## Execution order

1. Confirm **topic** and whether the goal is **pure understanding** vs **improvement assessment**.
2. Run **deep research** (blocking).
3. Ensure `./docs/research` exists.
4. Write the research file.
5. In the chat reply: give the **full path**, a **short summary**, and point to **Decision options** if present. Do not paste the full document unless asked.

## Quality bar

- Another agent or developer should be able to act on this without re-deriving the same map.
- Prefer tables and bullets for comparisons; use diagrams (mermaid) only when they clarify non-obvious flow.
- Call out **contradictions** between code, docs, and stated intent.

## Examples

**User:** `/research-and-document auth token refresh`  
**Agent:** Explore auth modules and middleware → write `docs/research/2026_05_17-auth-token-refresh.md`.

**User:** Same topic, improvement-focused: "research session handling before we refactor"  
**Agent:** Same exploration → include **Decision options** with a suggested path per decision.

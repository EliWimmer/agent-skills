---
name: ask-with-docs
description: Answers project questions using docs/context glossaries, plans, ADRs, and research. Use when the user asks what/why/how about the project, terminology, architecture, scope, or a path/file and wants docs-aware clarification; use /ask-with-docs to invoke.
argument-hint: "Question or topic"
---

# Ask with docs

Answer the user's question about the project. Load governing docs first, align with canonical domain language, and use codebase exploration when the answer is discoverable there.

## Asking the user

Ask **one question at a time**. Use the **AskQuestion** tool when it is available; follow [ASK-QUESTION.md](../_shared_references/ASK-QUESTION.md). Fall back to chat for open-ended questions.

**Clarifying questions** — before answering, ask when the user's message has no clear question or the active glossary cannot be inferred. Do not open a full grill for a single missing input.

See **When to grill** below for extended Q&A when ambiguity blocks a correct answer.

## Read docs first

Before answering, discover and read docs that govern the question area. Do not re-derive vocabulary or decisions already recorded under `docs/`.

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
2. Bind the question to artifacts:
   - User-named paths -> read in full.
   - Feature or area named -> search `docs/plans/`, `docs/research/`, and `docs/audits/` for the best match, then read it in full.
   - No explicit doc -> still read context glossaries when they exist.
3. Context glossary: follow **Choosing the active glossary** in [DOMAIN-AWARENESS.md](../_shared_references/DOMAIN-AWARENESS.md).
4. Plans in flight: when a plan applies, read the full plan and matching progress file.
5. ADRs and research: read linked or topic-relevant files before architectural, terminology-sensitive, or trade-off-heavy answers.
6. Audits: read prior audits under `docs/audits/` that overlap the question area.

Read entire plan and progress files - do not skim. Use canonical terms from glossaries; do not contradict accepted ADRs without calling out the conflict.

**Legacy:** repo-root or nested `CONTEXT.md` outside `docs/context/` may still exist - read as fallback; prefer `docs/context/` when present.

## Domain awareness

See [DOMAIN-AWARENESS.md](../_shared_references/DOMAIN-AWARENESS.md).

## Answering

Use the docs and code to answer precisely:

1. State the answer in canonical project language.
2. Distinguish what the docs say, what the code shows, and what is inferred.
3. Cite the most relevant doc and code paths instead of paraphrasing long excerpts.
4. If the answer depends on a trade-off or historical decision, point to the relevant ADR or plan.

If the question can be answered by exploring the codebase, explore the codebase instead of asking.

## When to grill

Default to answering. Switch to a **grill** - one question at a time, with a recommended answer each, waiting for feedback before continuing - only when:

- A glossary term conflict blocks the correct answer
- User intent is ambiguous enough that the answer would depend on a missing distinction
- Code and docs contradict each other and authority is unclear
- The answer would otherwise violate an accepted ADR or a documented decision

Do not grill when a quick code/doc read resolves the question.

During a grill, apply the same techniques as [grill-with-docs](../grill-with-docs/SKILL.md): challenge against the glossary, sharpen fuzzy language, stress-test with concrete scenarios, and cross-reference with code. Use **AskQuestion** for every grill question when the tool is available — see [ASK-QUESTION.md](../_shared_references/ASK-QUESTION.md).


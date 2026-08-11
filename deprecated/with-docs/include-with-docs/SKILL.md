---
name: include-with-docs
description: Loads the with-docs system context (active glossary, plans, ADRs, research, audits) into the session. Use when the user invokes /include-with-docs or wants docs-aware understanding primed before follow-up work; it doesn't request any specific action itself — it's the primer the rest of the with-docs family (ask, plan, fix, grill, audit, research) builds on.
disable-model-invocation: true
argument-hint: "Area, feature, or path to focus context loading"
---

# Include with docs

Load the governing `docs/` context for the session and surface it so the agent has with-docs system understanding — the active glossary, plans in flight, governing ADRs, and prior research/audits — ready for whatever comes next. It is the base layer the rest of the `*-with-docs` family builds on, useful when the user's next step is not yet a named verb.

## Asking the user

Ask **one question at a time**. Use the **AskQuestion** tool when it is available; follow [ASK-QUESTION.md](../_shared_references/ASK-QUESTION.md). Fall back to chat for open-ended questions.

Only ask what is needed to **focus** context loading — typically the bounded context or feature area when it cannot be inferred from the request or open files. Do not open a grill here; this skill resolves nothing.

## Read docs first

Discover and read the docs that govern the session before doing anything else. Do not re-derive vocabulary or decisions already recorded under `docs/`.

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
2. Bind the user's focus (named path, feature, or area) to artifacts:
   - User-named paths → read in full.
   - Feature or area named → search `docs/plans/`, `docs/research/`, and `docs/audits/` for the best match, then read it in full.
   - No explicit focus → read the top-level context and map only; wait for the user to direct the work.
3. Context glossary: follow **Choosing the active glossary** in [DOMAIN-AWARENESS.md](../_shared_references/DOMAIN-AWARENESS.md). Resolve the active glossary before reading plan/ADR/research bodies so vocabulary is canonical throughout.
4. Plans in flight: when a plan applies to the focus, read the full plan and matching progress file.
5. ADRs and research: read linked or topic-relevant files.
6. Audits: read prior audits under `docs/audits/` that overlap the focus.

Read entire plan and progress files — do not skim. Hold the loaded context in working memory for the follow-up task; do not start that task here.

**Legacy:** repo-root or nested `CONTEXT.md` outside `docs/context/` may still exist — read as fallback; prefer `docs/context/` when present.

## Domain awareness

See [DOMAIN-AWARENESS.md](../_shared_references/DOMAIN-AWARENESS.md).

## Including the context

After the read pass, report what was loaded so the user (and the next skill) can act on it. Keep the report short and structural, not a re-paste of doc bodies:

1. **Active glossary** — which context file governs and why it was chosen.
2. **Plans in flight** — plan slug, current phase from its progress file, and what remains.
3. **Governing decisions** — ADRs that constrain the focus area, each in one line with a link.
4. **Prior research and audits** — dated files that overlap, one line each with a link.
5. **Drift flags** — only if you noticed doc/code mismatch while reading; otherwise omit.

This skill doesn't ask for anything specific — it hands the loaded context back to the session. If the user's request already named a next step, carry on into it with the context now in hand rather than re-reading docs. Otherwise, wait for direction, or point to the right family member when a verb would fit:

- Answering → [ask-with-docs](../ask-with-docs/SKILL.md)
- Sharpening terminology → [grill-with-docs](../grill-with-docs/SKILL.md)
- Designing a change → [plan-with-docs](../plan-with-docs/SKILL.md)
- Implementing a plan → [implement-with-docs](../implement-with-docs/SKILL.md)
- Fixing a problem → [fix-with-docs](../fix-with-docs/SKILL.md)
- Investigating and writing it up → [research-with-docs](../research-with-docs/SKILL.md)
- Reviewing against intent → [audit-with-docs](../audit-with-docs/SKILL.md)

## When to grill

Default to **not** grilling — this skill loads context, it does not resolve ambiguity. Switch to a grill only when a glossary conflict or authority clash blocks even reading the right docs (e.g. two bounded contexts claim the same term and the active glossary cannot be picked). In that case hand off to [grill-with-docs](../grill-with-docs/SKILL.md) rather than grilling inline, then resume loading once the term is settled.

## Quality bar

- Every governing area present under `docs/` was read or explicitly noted as not applicable — context, adr, plans + progress, research, audits.
- Active glossary named with a reason; canonical terms used in the report.
- Plan/ADR/research/audit references are links with one-line summaries, not pasted bodies.
- The report hands off context, not a completed task — it doesn't answer the user's underlying question on its own unless the request already named that as the next step.
- Drift flagged only when observed, not invented.

## Examples

**User:** "/include-with-docs — I'm about to touch the billing area"
**Agent:** Read `docs/context/CONTEXT-MAP.md` → pick the `billing` sub-context as active glossary → read the in-flight `docs/plans/billing-migration.md` + its progress file, the two billing ADRs, and the latest billing audit → report active glossary, current phase, governing ADRs, and prior audit in one line each → no verb was named, so hand back to the user for the next step.

**User:** "/include-with-docs" (no focus given, repo has `docs/context/CONTEXT.md` only)
**Agent:** Read `docs/context/CONTEXT.md` as the active glossary → note no plans, ADRs, research, or audits exist → report that context is loaded and ask one question about which area the user wants to work in → wait.

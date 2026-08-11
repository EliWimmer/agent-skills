---
name: init-with-docs
description: Bootstraps a project's initial docs/context glossary and bounded-context structure by exploring the working directory and grilling the user one question at a time. Use when the user invokes /init-with-docs, a repo has no docs/context yet, or someone wants to set up the domain language and context that the rest of the *-with-docs skill family reads.
disable-model-invocation: true
argument-hint: "Project or area to initialise context for"
---

# Init with docs

Stand up the `docs/context/` foundation that every other `*-with-docs` skill reads. Explore the working directory to harvest candidate domain terms and bounded contexts, grill the user one question at a time to sharpen them, then write the first glossary (and `CONTEXT-MAP.md` when more than one context emerges). This is a one-time bootstrap — after it runs, sessions move to grill/plan/fix/research.

## Asking the user

Grilling **is** the main work of this skill, not a side step. Ask **one question at a time** and wait for the answer before continuing. Use the **AskQuestion** tool when it is available; follow [ASK-QUESTION.md](../_shared_references/ASK-QUESTION.md). For each question provide your recommended answer drawn from what you found exploring the code. Fall back to chat for open-ended naming and scenario questions.

If a question can be answered by exploring the codebase, explore instead of asking.

## Before initialising

Do **not** clobber existing documentation. Check state first and pick the right path:

```
docs/
└── context/
    ├── CONTEXT.md
    ├── CONTEXT-MAP.md
    └── <bounded-context>/<slug>.md
```

1. **`docs/context/` already has real glossary content** → do not re-init. Tell the user it exists and hand off to [grill-with-docs](../grill-with-docs/SKILL.md) to extend it, or [audit-with-docs](../audit-with-docs/SKILL.md) to assess it.
2. **Legacy or scattered context** (repo-root `CONTEXT.md`, nested `CONTEXT.md` under `src/`, etc.) → do not start fresh; recommend [context-cleanup](../../planning/context-cleanup/SKILL.md) to migrate into `docs/context/`, then return here only if gaps remain.
3. **No context docs at all** → proceed. Create `docs/context/` lazily — only once the first term is resolved, not up front.

## Domain awareness

See [DOMAIN-AWARENESS.md](../_shared_references/DOMAIN-AWARENESS.md) for the full `docs/` layout, legacy paths, and how the active glossary is chosen in later sessions.

## Explore the working directory

Harvest candidate domain language before grilling so every question carries a concrete recommendation:

- **README, docs, package metadata** — stated purpose, audience, and headline nouns
- **Top-level module / directory names** — candidate bounded contexts (semantic areas, not a mirror of `src/`)
- **Core types, models, schemas, entities** — recurring domain nouns and their relationships
- **Public APIs, route names, event names, CLI verbs** — the project's outward vocabulary
- **Synonym and alias smells** — the same concept named two ways across modules (e.g. `account` vs `customer`)

Produce a short shortlist of candidate terms, candidate bounded contexts, and flagged ambiguities. This shortlist seeds the grill — it is not the deliverable.

## Grill to sharpen

Walk the shortlist one question at a time, resolving dependencies between decisions as you go. Apply the techniques from [grill-with-docs](../grill-with-docs/SKILL.md):

- **Sharpen fuzzy language** — when a term is vague or overloaded, propose a precise canonical name and list the rejected words as aliases to avoid.
- **Resolve aliases** — when two words name one concept, make the user pick one. Be opinionated; recommend the better term.
- **Stress-test with scenarios** — invent concrete cases that force the boundary between two concepts to be explicit.
- **Cross-reference with code** — when the user describes how something works, confirm the code agrees and surface contradictions.
- **Decide the shape** — single context vs multiple bounded contexts; what is cross-cutting vs owned by one context. Recommend single-context unless the code clearly separates areas.

Capture each resolution into the glossary as it crystallises — do not batch them to the end.

## Write the initial context

Write glossaries using [CONTEXT-FORMAT.md](../_shared_references/CONTEXT-FORMAT.md):

- **`docs/context/CONTEXT.md`** — start here. For a single-context project, all terms live here. For multi-context, keep only cross-cutting terms (no single owner) here and link out to where each owned term is defined.
- **`docs/context/<bounded-context>/<slug>.md`** — one cohesive glossary cluster per file, created only when a bounded context genuinely separates. Subdirectory names are semantic kebab-case, not `src/` paths.
- **`docs/context/CONTEXT-MAP.md`** — create only when a second bounded context emerges. Index the contexts and their relationships per CONTEXT-FORMAT's CONTEXT-MAP section.

Keep definitions tight (one sentence, what it IS), flag every ambiguity with its resolution, and include an example dialogue that shows the terms interacting. Context files are glossaries only — no implementation details, specs, or scratch notes.

## Offer ADRs sparingly

A naming or boundary decision during init may deserve an ADR — but only when all three hold: hard to reverse, surprising without context, and the result of a real trade-off. If any is missing, skip it. Use [ADR-FORMAT.md](../_shared_references/ADR-FORMAT.md).

## Cross-linking outputs

When the work produces more than the single `CONTEXT.md`:

1. **CONTEXT-MAP.md** — one line per context under `## Contexts`, plus their relationships (order per [CONTEXT-FORMAT.md](../_shared_references/CONTEXT-FORMAT.md)).
2. **Glossaries** — `## Related` links (3–6 max) between sibling sub-contexts and to any ADR created here.

Do not duplicate definitions across files — link to the owner instead.

## Hand off

Close by telling the user what now exists and what reads it: the new `docs/context/` is the active glossary for [grill-with-docs](../grill-with-docs/SKILL.md), [plan-with-docs](../plan-with-docs/SKILL.md), [fix-with-docs](../fix-with-docs/SKILL.md), and the rest of the family. Point them at grill-with-docs to deepen terminology or plan-with-docs to start designing against it.

## Quality bar

- Did not overwrite or duplicate existing context docs (deferred to context-cleanup / grill when present).
- Every term is opinionated, single-sentence, and project-specific — no general programming concepts.
- Aliases resolved to one canonical term; ambiguities flagged with resolutions.
- Files created lazily; `CONTEXT-MAP.md` only when a second context exists.
- Glossaries contain only language — no specs or implementation notes.

## Examples

**User:** "/init-with-docs — we have no docs yet, set up the domain language for this billing service"
**Agent:** Confirm `docs/context/` is empty → explore code for entities (`Invoice`, `Charge`, `account`) → grill one question at a time to resolve `account` (Customer vs User), pick canonical terms → write `docs/context/CONTEXT.md` with Language, Relationships, and an example dialogue → hand off to grill/plan-with-docs.

**User:** "Set up context for the repo" (repo already has a root `CONTEXT.md`)
**Agent:** Detect the legacy file → do not start fresh → recommend [context-cleanup](../../planning/context-cleanup/SKILL.md) to migrate it into `docs/context/`, then offer to fill remaining gaps via grill.

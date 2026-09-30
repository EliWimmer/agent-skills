---
name: domain-modeling
description: Build, sharpen, and understand a project's domain model. Use when the user wants to pin down domain terminology or a ubiquitous language, record an architectural decision, or when another skill needs to read or maintain the domain model.
---

# Domain Modeling

Actively build and sharpen the project's domain model as you design. This is the _active_ discipline — challenging terms, inventing edge-case scenarios, and writing the glossary and decisions down the moment they crystallise. (Merely _reading_ `CONTEXT.md` for vocabulary is not this skill — that's a one-line habit any skill can do. This skill is for when you're changing the model, not just consuming it.)

## File structure

Most repos have a single context:

```
docs/
├── artifacts/                  ← generated artifacts (html reports, diagrams, etc.)
│   ├── <slug>.md
├── context/
│   ├── CONTEXT.md              ← cross-cutting terms only
│   ├── CONTEXT-MAP.md          ← index of bounded contexts (when more than one)
│   └── <bounded-context>/
│       └── <slug>.md
├── adr/
├── plans/
│   ├── prospective/<slug>.md   ← see Plan lifecycle
│   ├── planned/<slug>.md
│   ├── in-progress/<slug>.md
│   ├── complete/<slug>.md
│   └── archived/<slug>.md
├── processes/
│   └── <slug>.md
└── research/
    └── YYYY_MM_DD-<slug>.md
```

If a `CONTEXT-MAP.md` exists in `/docs/context`, the repo has multiple contexts. The map points to where each one lives:

Create files lazily — only when you have something to write. If no `CONTEXT.md` exists, create one when the first term is resolved. If no `docs/adr/` exists, create it when the first ADR is needed.

Use `docs/processes/` for repeatable operational instructions such as releases, migrations, and incident response. Process documents may contain implementation details; keep domain definitions in `docs/context/`.

### Plan lifecycle

A plan's directory is its status. When the status changes, move the file with `git mv`, keep its slug, and update every link to it, including the **Plans** index in `CONTEXT-MAP.md`.

| Directory | Status |
| --- | --- |
| `prospective/` | A design worth keeping that nobody has committed to building. It may have no tasks yet. |
| `planned/` | Committed work with tasks written by `/writing-plans`. Not started. |
| `in-progress/` | Being implemented. Tick each task's checkboxes as it's done. |
| `complete/` | Every task ticked and verified. |
| `archived/` | Abandoned or superseded. Add a line under the title saying why, linking the successor if there is one. |

Progress lives in the plan's checkboxes. Promoting a `prospective/` plan to `planned/` means running `/writing-plans` on it. Create each status directory when the first plan needs it.

## During the session

### Challenge against the glossary

When the user uses a term that conflicts with the existing language in `CONTEXT.md`, call it out immediately. "Your glossary defines 'cancellation' as X, but you seem to mean Y — which is it?"

### Sharpen fuzzy language

When the user uses vague or overloaded terms, propose a precise canonical term. "You're saying 'account' — do you mean the Customer or the User? Those are different things."

### Discuss concrete scenarios

When domain relationships are being discussed, stress-test them with specific scenarios. Invent scenarios that probe edge cases and force the user to be precise about the boundaries between concepts.

### Cross-reference with code

When the user states how something works, check whether the code agrees. If you find a contradiction, surface it: "Your code cancels entire Orders, but you just said partial cancellation is possible — which is right?"

### Update CONTEXT.md inline

When a term is resolved, update `CONTEXT.md` right there. Don't batch these up — capture them as they happen. Use the format in [CONTEXT-FORMAT.md](references/CONTEXT-FORMAT.md).

`CONTEXT.md` should be totally devoid of implementation details. Do not treat `CONTEXT.md` as a spec, a scratch pad, or a repository for implementation decisions. It is a glossary and nothing else.

### Offer ADRs sparingly

Only offer to create an ADR when all three are true:

1. **Hard to reverse** — the cost of changing your mind later is meaningful
2. **Surprising without context** — a future reader will wonder "why did they do it this way?"
3. **The result of a real trade-off** — there were genuine alternatives and you picked one for specific reasons

If any of the three is missing, skip the ADR. Use the format in [ADR-FORMAT.md](references/ADR-FORMAT.md).

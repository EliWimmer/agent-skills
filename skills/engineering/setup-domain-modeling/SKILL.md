---
name: setup-domain-modeling
description: Bootstraps a project's domain model through codebase discovery, parallel domain research, an agreed interactive baseline, and AGENTS.md pointers.
disable-model-invocation: true
---

# Set Up Domain Modeling

Establish the project's first trustworthy domain baseline. Use `/domain-modeling` for every glossary, context-map, and ADR change. Use `/grilling` for the interactive phase. After the baseline is agreed, point the repo-root `AGENTS.md` at that model.

The baseline is a starting point, not a complete model. It names the contexts, their purpose and ownership, the core terms, and how the contexts relate. Rules, invariants, lifecycles, edge cases, and implementation detail get added later, as `/grill-with-docs`, `/fix-with-docs`, and the other with-docs skills run against real work. When a question goes below that level, write it down as an open question and move on.

## 1. Discover the domain landscape

Read the repository instructions, existing project documentation, entry points, product surfaces, major workflows, persistence boundaries, and external integrations. Trace the product from user-visible capabilities into the code; treat directory and service boundaries as evidence, not as domain boundaries by default.

Propose the smallest set of top-level product domains that covers the project. For each candidate, state its purpose, users or actors, capabilities, likely ownership boundary, code evidence, and overlaps still needing resolution.

This phase is complete when every user-visible capability and major external interface is assigned to a candidate domain or explicitly identified as cross-cutting or unresolved.

## 2. Run parallel domain expeditions

Spawn one subagent per candidate domain and run them in parallel, batching only when concurrency limits require it. Give every subagent the same boundary hypothesis and require a read-only report covering:

- canonical and conflicting language;
- actors, use cases, rules, invariants, and lifecycle states;
- important concepts and their relationships or cardinalities;
- commands, events, data ownership, and integrations at domain boundaries;
- evidence from product UI, documentation, code, schemas, and tests;
- contradictions, boundary leaks, and decisions the code cannot answer.

Expeditions can read deeply, but reports stay at domain level. Implementation detail is evidence for a boundary or a term. It is not a finding in its own right.

Keep documentation ownership with the coordinating agent so parallel reports cannot create competing models. Reconcile the reports only after every candidate domain has returned.

This phase is complete when every candidate has an evidence-backed report and every cross-domain relationship appears in the reports from both sides or is flagged for reconciliation.

## 3. Build the provisional model

Reconcile duplicate concepts, conflicting names, ownership disputes, and mismatched relationships across the reports. Draft:

- the bounded-context map and the purpose of each context;
- cross-cutting language;
- context-owned terms, relationships, and examples;
- context-to-context interactions and ownership direction;
- a decision tree of unresolved product questions, ordered by dependency.

Put a question in the decision tree only if its answer changes a context boundary, a canonical term, or how contexts relate. List everything else as a deferred open question.

Keep implementation findings as evidence rather than glossary definitions. When the discovery record is too detailed to hold in the session, preserve it under `docs/research/`; keep only resolved product language in `docs/context/`.

This phase is complete when the provisional model accounts for every expedition report and each contradiction is either reconciled or represented by one explicit user decision.

## 4. Grill to shared understanding

Begin a `/grilling` session while applying `/domain-modeling`. Ask one decision at a time, give a concrete recommended answer, and wait for the user's response. Resolve dependencies in this order unless the evidence demands another:

1. product purpose, users, and outcomes;
2. bounded-context boundaries and ownership;
3. canonical terms and avoided aliases;
4. core relationships between terms;
5. interactions between contexts and external systems.

Look up answerable facts in the repository. Put product choices to the user. Test an accepted answer with one concrete scenario when the boundary or term is still unclear. Surface contradictions with the code or earlier answers when they affect the baseline.

Before each question, ask whether the answer would change a context boundary, a canonical term, or how contexts relate. If not, it is out of scope for setup. Add it to the open questions and move on. Do not ask about implementation choices, field names, error handling, or individual edge cases.

After each accepted decision, update the appropriate `docs/context/` glossary or `CONTEXT-MAP.md` immediately through `/domain-modeling`. Record an ADR only when that skill's ADR criteria are met. Documentation is the work of this session; product implementation begins only under a separate user request.

Continue until every branch in the decision tree is resolved and documented. Then present the complete baseline for one final confirmation. This phase is complete only when the user explicitly agrees that the baseline represents the product and its domains.

## 5. Audit the baseline

Re-read the resulting model against the repository and all expedition reports. Verify that every top-level domain is mapped, every mapped context has owned language, every important relationship has a direction, glossary definitions contain product meaning rather than implementation detail, links resolve, and remaining uncertainties are clearly separated from agreed knowledge.

Report the resulting contexts, files, resolved ambiguities, and the deferred open questions. This phase is complete when the audit passes and the user's final agreement is recorded.

## 6. Point AGENTS.md at the model

Create `AGENTS.md` at the repo root if it does not exist. If it already exists, add a short section. Do not replace unrelated project instructions.

Tell agents to:

- read `docs/context/CONTEXT-MAP.md` when it exists, otherwise `docs/context/CONTEXT.md`
- use `/domain-modeling` when language or decisions change
- use `/ask-with-docs`, `/fix-with-docs`, `/grill-with-docs`, `/research-with-docs`, `/document-process`, `/brainstorming`, and `/writing-plans` for the matching jobs

Keep it a pointer. Do not copy glossary text. Verify the links resolve.

The setup is complete when the audit has passed, the user's final agreement is recorded, and `AGENTS.md` points at the model.

---
name: research-with-docs
description: Researches a project question using its documented domain model and writes an evidence-backed report. Use when the user asks to investigate a project topic or create a research report under docs/research.
---

# Research with docs

Research the user's question using the `/domain-modeling` skill.

## 1. Establish the documented context

Read the repository instructions and the relevant files in `docs/context/`, `docs/adr/`, `docs/plans/`, and `docs/research/`. Follow links that govern the topic. State the question, scope, and what evidence would answer it.

This step is complete when the governing domain language, prior decisions, related work, and unresolved questions are accounted for.

## 2. Investigate the project

Trace the question through the relevant product behavior, code, schemas, tests, generated artifacts, and external interfaces. Distinguish documented facts, code evidence, and inference. Use canonical project terms and surface contradictions through `/domain-modeling`.

This step is complete when every conclusion has inspectable evidence and material contradictions or evidence gaps are explicit.

## 3. Write the research report

Create `docs/research/YYYY_MM_DD-<slug>.md`. Include:

- the research question and scope;
- a concise conclusion;
- findings with repository-relative evidence paths;
- contradictions, risks, and unknowns;
- recommendations, ordered by impact and confidence;
- links to related context, ADRs, plans, and research.

Keep implementation details in the report. If the research resolves domain language or an architectural decision, let `/domain-modeling` update the appropriate glossary or ADR under its own criteria, then link that document from the report.

This step is complete when the report answers the question, supports each conclusion, separates fact from inference, and resolves every internal link.

## 4. Verify and hand off

Re-read the report against its cited evidence. Report the created path, the main conclusion, and any question that still requires a user decision.

The research is complete when the report and any domain-model updates agree with the repository evidence.

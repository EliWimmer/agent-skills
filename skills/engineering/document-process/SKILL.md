---
name: document-process
description: Documents a repeatable project process as detailed, easy-to-follow instructions grounded in the project's domain model. Use when the user asks to write a runbook, release procedure, operational guide, or process document under docs/processes.
---

# Document a process

Document the requested process using the `/domain-modeling` skill.

## 1. Establish the process boundary

Read the repository instructions and relevant files in `docs/context/`, `docs/adr/`, `docs/plans/`, `docs/processes/`, and `docs/research/`. Identify the process goal, trigger, audience, prerequisites, inputs, completion signal, and actions that fall outside its scope.

This step is complete when a reader can tell when to use the process, what they need before starting, and what successful completion means.

## 2. Trace the real process

Inspect the scripts, configuration, CI workflows, code, tests, external systems, and prior release or operational records that implement the process. Use canonical project terms. Resolve conflicting or fuzzy language through `/domain-modeling` and surface discrepancies between documentation and the working system.

This step is complete when every required action, decision branch, side effect, and recovery path has repository evidence or an explicit evidence gap.

## 3. Write the process document

Create `docs/processes/<slug>.md`. Write for a capable reader performing the process for the first time. Include:

- purpose, scope, and trigger;
- prerequisites, permissions, inputs, and tools;
- numbered steps with exact commands or UI actions;
- the expected result and verification check after each consequential step;
- decision branches, failure recovery, rollback, and safe retry points;
- the final completion checklist;
- repository-relative links to governing context, ADRs, scripts, and related documents.

Name environment-specific values as placeholders and explain how to obtain them. Mark irreversible or externally visible actions before the reader reaches them. Keep product language in `docs/context/`; keep operational details in the process document. If the work resolves domain language or an architectural decision, let `/domain-modeling` update the appropriate glossary or ADR under its own criteria, then link it from the process.

This step is complete when the document contains no hidden prerequisite, unexplained command, ambiguous branch, or unverified completion claim.

## 4. Verify the instructions

Walk through the document against the current project using read-only checks and safe dry runs. Confirm commands, paths, links, ordering, expected results, and recovery instructions. Record anything that requires access or a real side effect as an explicit verification gap.

Report the created path, what evidence supports it, and any gap the user must validate in a real run.

The work is complete when a first-time reader can follow the document from its trigger to its completion checklist without relying on unwritten project knowledge.

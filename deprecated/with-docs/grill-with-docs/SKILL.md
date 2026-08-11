---
name: grill-with-docs
description: Grilling session that challenges your plan against the existing domain model, sharpens terminology, and updates documentation (docs/context glossaries, ADRs) inline as decisions crystallise. Use when the user invokes /grill-with-docs or wants to stress-test a plan against their project's language and documented decisions.
disable-model-invocation: true
argument-hint: "Plan or design to stress-test"
---

# Grill with docs

Interview the user relentlessly about every aspect of the plan until you reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time, waiting for feedback on each question before continuing.

If a question can be answered by exploring the codebase, explore the codebase instead.

## Asking the user

Ask **one question at a time**. Follow [ASK-QUESTION.md](../_shared_references/ASK-QUESTION.md). Fall back to chat for open-ended questions.

## Read docs first

Before grilling, read governing docs for the plan area. See [DOMAIN-AWARENESS.md](../_shared_references/DOMAIN-AWARENESS.md) for layout, legacy paths, and **Choosing the active glossary**. Read entire plan and progress files when a plan applies — do not skim.

## Domain awareness

See [DOMAIN-AWARENESS.md](../_shared_references/DOMAIN-AWARENESS.md).

## During the session

### Challenge against the glossary

When the user uses a term that conflicts with existing language in the active glossary (or top-level `CONTEXT.md`), call it out immediately. "Your glossary defines 'cancellation' as X, but you seem to mean Y — which is it?"

### Sharpen fuzzy language

When the user uses vague or overloaded terms, propose a precise canonical term. "You're saying 'account' — do you mean the Customer or the User? Those are different things."

### Discuss concrete scenarios

When domain relationships are being discussed, stress-test them with specific scenarios. Invent scenarios that probe edge cases and force the user to be precise about the boundaries between concepts.

### Cross-reference with code

When the user states how something works, check whether the code agrees. If you find a contradiction, surface it: "Your code cancels entire Orders, but you just said partial cancellation is possible — which is right?"

### Update the active glossary inline

When a term is resolved, update the active glossary right there. Don't batch these up — capture them as they happen. Use the format in [CONTEXT-FORMAT.md](../_shared_references/CONTEXT-FORMAT.md).

Context files are glossaries only — no implementation details, specs, or scratch notes.

### Offer ADRs sparingly

Only offer to create an ADR when all three are true:

1. **Hard to reverse** — the cost of changing your mind later is meaningful
2. **Surprising without context** — a future reader will wonder "why did they do it this way?"
3. **The result of a real trade-off** — there were genuine alternatives and you picked one for specific reasons

If any of the three is missing, skip the ADR. Use the format in [ADR-FORMAT.md](../_shared_references/ADR-FORMAT.md).

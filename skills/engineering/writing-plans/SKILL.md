---
name: writing-plans
description: Writes design and implementation plans under docs/plans. Use when turning agreed requirements into a plan, expanding an existing design into implementation steps, or promoting a prospective plan.
disable-model-invocation: true
---

# Writing plans

Write a plan that explains the intended behavior, the important design decisions, and the order of implementation. Give a capable engineer enough context to continue without reconstructing the conversation. Keep detail proportional to the work.

## Ground the plan

Read the repository instructions, relevant context and decisions, existing plans, and the affected code. Use the project's canonical terms and existing ownership boundaries. Use `/domain-modeling` when terms or domain decisions need to change.

Distinguish what already works from what is proposed. Name existing integration points with real paths; label proposed files or directories as new. Describe contracts and responsibilities precisely where later work depends on them. Include code only when it clarifies an otherwise ambiguous contract or algorithm; do not prewrite the implementation.

Resolve questions that would materially change the design. Record bounded assumptions and unresolved decisions explicitly, including what they block. Do not invent certainty or leave vague instructions such as “handle edge cases.”

## Locate and size the plan

Follow the repository's plan conventions. Where it uses the `/domain-modeling` lifecycle, save plans as `docs/plans/<status>/<slug>.md`:

- Expand an existing design in place, including one handed off from `/brainstorming`. Preserve agreed decisions and completed work; consolidate duplicate sections and replace obsolete test-first or commit instructions in the plan being edited.
- Put new implementation plans in `planned/`. Keep designs for later in `prospective/`, where an implementation sequence may be unnecessary. Use `in-progress/` when the user has authorized starting the work.
- When promoting or moving a plan, retain its slug and update incoming links and any existing Plans index in `docs/context/CONTEXT-MAP.md`.

For work spanning independently deliverable subsystems, use a short overview linking the focused plans in dependency order. Each focused plan should own a coherent outcome and name the contracts it consumes or supplies. Keep a single plan when splitting would scatter one change across documents.

## Write the design and sequence

Use the section structure below as a starting point. Keep Goal, Implementation sequence, and Acceptance clear for an implementation plan; combine or omit other sections when they add no useful information. Adapt Design subsections to the actual work. Add current-state evidence or a diagnosis when it explains why the change is needed.

Order numbered implementation steps by dependency. Each step should deliver a meaningful capability or settle a necessary prerequisite. Use checkboxes for concrete changes, followed by a short completion condition when the boundary is not obvious. Fold setup, configuration, migration, and documentation into the step that needs them.

Identify the owning components, relevant paths, required behavior, and important failure cases within the design or sequence. Use a component table when it makes responsibilities easier to scan. A separate exhaustive file inventory, full code listings, exact line numbers, or minute-by-minute instructions are not required.

### Testing restraint

Do not organize the work around test-driven development or failing-test/pass-test cycles. Mention only minimal, lean tests for high-risk boundaries where the specific scenario matters to the design, such as authorization, data isolation, destructive persistence or migrations, concurrency, and lifecycle cleanup. Prefer extending relevant existing coverage. Do not prescribe a test for every function, wrapper, component, or checkbox.

Fold a necessary test scenario into the step that owns the boundary. Omit a default Testing section, routine “run tests” reminders, lists of test/check commands, and routine verification-only tasks. The implementing agent chooses and runs normal checks. Express acceptance as observable behavior and invariants, including the user flow that must work, rather than a testing procedure. Do not include commits, commit messages, staging, branching, or other Git workflow steps in the plan.

## Review and hand off

Check that the sequence covers the goal and constraints, dependencies are in the right order, contracts agree across steps and linked plans, and acceptance describes the complete outcome. Remove duplicated instructions, speculative features, and unnecessary testing detail. Check that proposed work is clearly separated from existing behavior and known gaps are visible.

Link the finished plan and briefly state any decisions still needed. Writing a plan does not itself authorize implementation; continue into implementation when the user's request already includes it. During authorized implementation, track progress in the checkboxes and add short implementation notes only for material deviations, limitations, or handoff facts. Checked tasks alone do not establish that the goal works; move a plan to `complete/` only when its acceptance conditions are met.

## Plan structure

```md
# <Title>

## Goal

<Intended outcome, who it serves, and the behavior that will become possible.>

## Constraints

- <Requirement or invariant the implementation must preserve.>

## Approach

<Chosen approach and why. Briefly explain rejected alternatives when useful.>

## Design

### Architecture

<Ownership, boundaries, and how this fits the existing system.>

### Components

<Responsibilities, contracts, and relevant existing or proposed paths.>

### Data flow

<The important interactions from initiation through the resulting state.>

### Error handling

<Concrete failures and the required recovery or preservation behavior.>

## Implementation sequence

### 1. <Meaningful deliverable>

- [ ] <Concrete change with its owning component or integration point.>
- [ ] <Another change needed for this deliverable.>

Completion: <Observable condition that makes the next step possible.>

### 2. <Next deliverable>

- [ ] <Change that consumes the previous step's result.>

## Acceptance and handoff

<The complete user-visible outcome and critical invariants. Name contracts or
remaining work handed to another plan when relevant.>

## Out of scope

- <Deliberately excluded work that might otherwise be assumed.>

## Related

- <Relative links to governing context, decisions, research, and related plans.>
```

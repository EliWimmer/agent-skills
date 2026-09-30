---
name: brainstorming
description: Turn an idea into an approved design, and a plan under docs/plans, before any code is written.
disable-model-invocation: true
---

# Brainstorming

Turn an idea into a design the user has approved, using the `/domain-modeling` skill. The design is the gate: implementation starts only after the user approves the design for the chosen path.

## Gate

Before any implementation action (writing product code, scaffolding, installing dependencies, creating a project, or invoking an implementation skill), the chosen path's approval must exist:

- **Spike**: the user approved the question and the probe.
- **Bounded**: the user approved the short design in chat.
- **Architectural**: the user approved the written plan, or chose to start work right away (see step 4).

An approval covers only the stage the user saw. Agreeing to an idea doesn't approve a design that hasn't been written yet. After an interruption, resume at the earliest incomplete stage. Read-only exploration is always allowed.

## 1. Read the documented context

Read the repository instructions and whatever in `docs/context/`, `docs/adr/`, `docs/plans/`, and `docs/research/` bears on the idea. Check the code and recent commits for the area it touches.

This step is complete when you know the domain terms, prior decisions, and existing code the idea touches, and whether an existing plan already covers it.

## 2. Classify and announce the path

Pick one path and say it out loud so the user can override it: "This looks bounded, so I'll give you a short design here instead of a plan file."

- **Spike**: a feasibility question whose output is an answer, not code you keep.
- **Bounded**: a well-scoped change to a flow that already exists in this repo: a new flag, a small endpoint, a one-file fix. If there is no existing flow to read, the task is not bounded.
- **Architectural**: a new project, a new subsystem, or a change to interfaces other code depends on.

When two paths both fit, take the heavier one. The path is a one-way ratchet: if hidden complexity shows up mid-task, stop, say so, and move up. Paths never move down.

If the idea spans several independent subsystems, say so before asking detail questions. Help the user split it into sub-projects and the order to build them, then brainstorm the first one. Each sub-project gets its own plan.

This step is complete when the user has seen the classification and hasn't overridden it.

## 3. Establish shared understanding

Write back what you understand in a short note: the intended outcome, who it's for, constraints, and what success looks like. Mark what the user said separately from what you assumed. If the request already states purpose and constraints, reflect them back rather than asking again.

Then ask what's still missing, following the `/grilling` rules: one question per message, each with your recommended answer, multiple choice when the options are known. Look up facts in the repo yourself. Put decisions to the user. When a term is fuzzy or conflicts with the glossary, resolve it through `/domain-modeling`.

This step is complete when the user has corrected or confirmed the note and every question that would change the design has an answer.

## 4. Follow the path

### Spike

1. Present the question and the probe in 2–3 sentences, then wait for a nod.
2. Investigate as cheaply as correctness allows.
3. Report a recommendation. Label anything you built as throwaway. Keeping the spike's code is a new request, so classify it again.

### Bounded

1. Present the design in chat: approach, files touched, how it will be tested. A few sentences to a few short paragraphs.
2. Stop and wait for an explicit yes. Starting the work in the same message as the design skips the gate.
3. Implement through the normal workflow. There's no plan file.

### Architectural

1. **Approaches.** Propose 2–3 approaches with trade-offs. Lead with the one you recommend and say why. Apply YAGNI to each: cut features nobody asked for.
2. **Design in sections.** Present the design one section at a time: architecture, components, data flow, error handling, testing. Size each section to its complexity, up to about 300 words. Ask whether each section looks right before moving on, and revise when it doesn't.
3. **Choose a status.** Ask where the plan goes, and wait for the answer:
   - **Prospective**: keep the design for later. No tasks yet.
   - **Planned**: commit to it and write the tasks, but don't start.
   - **Start now**: write the tasks and begin implementing. The plan goes in `in-progress/`.
4. **Write the design.** Save it to `docs/plans/<status>/<slug>.md` using the template below. Status directories and moves follow the plan lifecycle in `/domain-modeling`. When `docs/context/CONTEXT-MAP.md` exists, add the plan to its **Plans** index. Offer an ADR through `/domain-modeling` only for decisions that meet its criteria.
5. **Self-review.** Re-read the design once and fix inline: placeholders or TBDs, sections that contradict each other, requirements that could be read two ways, scope too broad for one plan, features nobody asked for.
6. **Hand off.**
   - **Prospective**: ask the user to review the design file and apply their changes. The path ends here.
   - **Planned** or **start now**: invoke `/writing-plans` on the file. It adds the tasks, then waits for review (planned) or starts Task 1 (start now). Choosing start now is the user's approval to implement.

## Design for isolation

Break the system into units that each have one purpose and a clear interface. For each unit you should be able to say what it does, how it's used, and what it depends on. If someone would have to read a unit's internals to use it, the boundary needs work.

In an existing codebase, follow its patterns. Include targeted cleanups only where existing code gets in the way of this goal.

## Visual questions

When a question is clearer shown than described, such as a layout choice or a data-flow diagram, write a self-contained HTML mockup to `docs/artifacts/<slug>.html` and open it with `/cmux-browser` when available. Use this per question, not per session. A question about a UI topic is not automatically a visual question: "what should onboarding cover?" is text, and "which of these two layouts?" is visual.

## Plan template

```md
# <Title>

## Goal

<Intended outcome, who it's for, and what success looks like.>

## Constraints

- <Constraint the design must respect>

## Approach

<Chosen approach and why. One line for each rejected alternative.>

## Design

### Architecture
### Components
### Data flow
### Error handling
### Testing

## Out of scope

- <Deliberately excluded item>

## Related

- <Links to context, ADRs, research>
```

`/writing-plans` adds its task sections before **Out of scope**. Use the project's canonical terms throughout. Keep glossary definitions in `docs/context/`, and link to them from the plan.

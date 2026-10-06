---
name: writing-plans
description: Turn an approved design into ordered implementation tasks in its plan file under docs/plans.
disable-model-invocation: true
---

# Writing plans

Turn an approved design into tasks an implementer can carry out with the repo and the plan and nothing else. Every decision gets made here, so implementing is a matter of following the tasks in order.

## 1. Locate the design

The input is a plan file under `docs/plans/` holding a design the user approved, usually written by `/brainstorming`. If the design was agreed in this conversation instead, save it to `docs/plans/planned/<slug>.md` first with its goal, approach, and out-of-scope list. With no approved design at all, tell the user the work needs `/brainstorming` and stop there.

A plan in `prospective/` moves to `planned/` as part of this run. Status directories and moves follow the plan lifecycle in `/domain-modeling`.

This step is complete when you hold one plan file with an approved design and know whether the user wants it reviewed first (planned) or started now (in-progress).

## 2. Ground the design in the code

Read every file the design touches, plus one existing example of each kind of thing it adds: a neighbouring endpoint, command, migration, or test. The plan names real paths and real symbols, and points at the example to mirror.

Find the **checks** the project already uses on itself: its test command and its native checks such as typecheck, lint, and build. Look in package scripts, the Makefile, CI config, and the repository instructions. In a project with no test suite, the checks are whatever it does have: a build, a validator, a dry run.

When the code contradicts the design, or the design leaves open a decision that tasks depend on, settle it with the user before writing tasks: one question per message, each with your recommended answer. Write the answer into the plan's design sections so the design stays true.

This step is complete when every path the plan will name is one you have opened or one the plan creates, the checks are known, and no task waits on an open decision.

## 3. Slice the work

Lead with a tracer bullet: the thinnest slice that runs end to end through every layer the design touches. Later tasks widen it. Place the task carrying the most uncertainty as early as its dependencies allow, while the plan is still cheap to change.

Size each task as one reviewable commit that leaves the checks passing. Order tasks so each builds only on the ones before it.

This step is complete when you have an ordered list of task outcomes and can say what works after each one.

## 4. Write the tasks

Add a `## Tasks` section to the plan, before **Out of scope**, using the template below. Use the project's canonical terms from `docs/context/`.

Specify decisions exactly and leave the code to the implementer. Wherever two tasks or two systems meet, write the contract out literally: signatures, data shapes, schema, config keys, error behaviour, names. Describe what sits inside a boundary in a sentence. Each step is a single action naming what changes and where, listed in the order to do it.

```md
## Tasks

**Checks:** `<test command>`, `<typecheck, lint, build commands>`

### Task 1: <outcome in a phrase>

<What works once this lands, and what it builds on.>

**Files:** create `path/to/new.ts`; modify `path/to/existing.ts` (`symbolName`)
**Contract:** <signatures, data shapes, and names other tasks rely on, written exactly>
**Mirror:** `path/to/similar.ts`

- [ ] <Implementation step>
- [ ] <Implementation step>
- [ ] Test: <high-risk boundary>: <the cases that prove it>
- [ ] Checks pass
```

**Checks** is written once and every task's last box refers to it. Include **Contract** and **Mirror** when a task has them. Include the test step when the task crosses a high-risk boundary, as defined under Tests.

This step is complete when every requirement in the design maps to a task or to **Out of scope**, every path, name, and signature is spelled the same everywhere it appears, and each step can be acted on with no further decision.

## 5. Hand off

- **Planned**: give the user the plan's path, ask them to review the tasks, and wait.
- **Start now**, or the user approves a planned plan: move the plan to `in-progress/` if it isn't there, then execute it.

## Tests

Tests go where a defect would be expensive and quiet: code that parses or validates input from outside the system, moves money or permissions, writes or migrates data, coordinates concurrent work, or encodes rules with enough branches to get wrong. Name the boundary in the task and list the few cases that would catch a real regression, typically the main path and the edge the design worried about. Test through the boundary's public interface, with real collaborators wherever they are cheap to run.

Everything else rides on the checks and the tests the project already has. Most tasks carry no test step, and that is the expected shape of a good plan.

Within a task, the implementation steps come first and the test step follows, so the test is written against the interface that actually landed.

## Executing

Work the tasks in order. For each one, do its steps, run the checks, and tick each box as it's done. A task is done when its boxes are ticked and the checks pass. The plan is done when every task is.

When the code turns out different from what a task assumed, update the plan and then continue, so the plan stays the record of what is being built. A change to the design itself goes to the user first.

When the plan is done, move it to `complete/` and tell the user what was built and what the checks reported.

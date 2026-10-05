---
name: writing-plans
description: Writes a task-by-task implementation plan under docs/plans before code is touched. Use when there is an approved design or requirements for multi-step work, when promoting a prospective plan, or when another skill needs a plan written.
disable-model-invocation: true
---

# Writing plans

Write the implementation plan for an approved design, using the `/domain-modeling` skill for project terms and for the plan lifecycle. Write for an engineer who is skilled but knows nothing about this codebase, its toolset, or its domain, and who is weak at test design. Give them every file, command, and piece of code they need as small tasks. DRY, YAGNI, test-first, frequent commits.

## 1. Locate the plan file

The plan is one file at `docs/plans/<status>/<slug>.md`. Pick the case that applies:

- **Handed off from `/brainstorming`**: the file already holds the design, in the status directory the user chose. Add the tasks to it.
- **Promoting a prospective plan**: `git mv` it from `prospective/` to `planned/`, then add the tasks.
- **Starting from requirements**: create the file in `planned/`, or in `in-progress/` when the user wants work to start right away. Write a short **Goal** and **Approach** first.

Read the design, the governing context in `docs/context/` and `docs/adr/`, and the code the work touches. If the design covers several independent subsystems, suggest one plan per subsystem, each producing working, testable software on its own.

This step is complete when the file is in the right status directory and you can name every file the design touches.

## 2. Map the files

List each file to create or modify and what it's responsible for. This is where you lock in how the work divides up:

- Each file has one responsibility and a clear interface. Prefer small, focused files.
- Files that change together live together. Split by responsibility, not by technical layer.
- In an existing codebase, follow its patterns. Split a file you're modifying only when it has grown unwieldy.

This step is complete when every requirement in the design maps to at least one listed file.

## 3. Write the tasks

A task is the smallest unit that has its own test cycle and could be rejected by a reviewer while its neighbor is approved. Fold setup, config, and docs into the task whose deliverable needs them. Each task ends with something testable on its own.

Each step inside a task is one action of 2–5 minutes: write the failing test, run it and watch it fail, write the minimal code, run it and watch it pass, commit.

Every step contains the actual content. A plan that contains any of these has failed:

- "TBD", "TODO", "implement later", "fill in details"
- "Add appropriate error handling", "add validation", "handle edge cases"
- "Write tests for the above" without the test code
- "Similar to Task N" (repeat the code, since tasks may be read out of order)
- A step that says what to do without showing how, such as a code step with no code block
- A type, function, or method that no task defines

This step is complete when every file from step 2 appears in some task and every code step has its code.

## 4. Self-review

Re-read the design and check the plan against it. Fix problems inline as you find them.

1. **Coverage**: point to a task for each requirement in the design. Add a task for any gap.
2. **Placeholders**: search for everything on the list in step 3.
3. **Consistency**: names, signatures, and types used in later tasks match where earlier tasks defined them. `clearLayers()` in Task 3 and `clearFullLayers()` in Task 7 is a bug.
4. **Review focus**: find the inputs or failure modes the design implies but no test exercises. List the five most likely to bite a real user in **Review focus**, and add each one's test to the task that owns the code. An empty list means you checked and found none.

This step is complete when all four checks pass.

## 5. Hand off

Link the plan and follow its status:

- **`planned/`**: ask the user to review it, then wait. Apply requested changes and repeat step 4.
- **`in-progress/`**: the user already asked to start, so begin with Task 1. Tick each step's checkbox as you finish it, and commit at the end of each task. When every task is ticked and verified, `git mv` the plan to `complete/` and update links to it.

## Plan sections

Add these sections to the plan file, after the design sections and before **Out of scope** / **Related** when those exist:

````md
## Global constraints

<Project-wide requirements every task must respect: version floors, dependency limits, naming and copy rules, platform requirements. One per line, exact values copied from the design.>

## Review focus

<Up to five inputs or failure modes, most likely first, each with the behavior a reasonable user would expect.>

## File structure

- `path/to/file.ts`: <responsibility>

## Tasks

Tick each step's checkbox as it's done.

### Task 1: <Component name>

**Files:**
- Create: `exact/path/to/file.ts`
- Modify: `exact/path/to/existing.ts:123-145`
- Test: `exact/path/to/file.test.ts`

**Interfaces:**
- Consumes: <exact signatures used from earlier tasks>
- Produces: <exact names, parameters, and return types later tasks rely on>

- [ ] **Step 1: Write the failing test**

```ts
test('specific behavior', () => {
  expect(fn(input)).toBe(expected);
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `<exact test command>`
Expected: FAIL with "<message>"

- [ ] **Step 3: Write the minimal implementation**

```ts
export function fn(input: Input): Output {
  return expected;
}
```

- [ ] **Step 4: Run it and confirm it passes**

Run: `<exact test command>`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add <files>
git commit -m "<message>"
```
````

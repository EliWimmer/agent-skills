---
name: testing
description: Lean tests as guards at real risk boundaries. Use when writing, reviewing, or deleting tests, or deciding whether a change needs a test at all.
---

# Testing

A test is a **guard**: it sits at a risk boundary and fails when that boundary breaks. Tests are not a specification of the code and not a measure of coverage. Write the code first, get it working, then guard what is worth guarding.

When exploring the codebase, read `GLOSSARY.md` (if it exists) so test names and interface vocabulary match the project's domain language, and respect ADRs in the area you're touching.

## Risk boundaries: what gets a test

A **risk boundary** is a place where a silent break would be expensive and nothing else would catch it. Types, lint, and running the app all count as "something else".

These qualify:

- **Money, auth, permissions, data loss or corruption.**
- **External contracts**: public API shapes, webhooks, migrations.
- **Complex logic you can't verify by reading it**: parsers, date maths, state machines.
- **Bugs that have already happened.**

Glue code, UI layout and passthroughs are out by default.

**Zero tests is a valid outcome.** If a change crosses no risk boundary, write no test and say so: "no guard needed, because X". The omission is then a decision, not an oversight.

When a spec lists risk boundaries, guard those. If you discover a boundary the spec missed, guard it too and report it.

## What a good test is

Tests verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't. A good test names the failure it prevents: "user can checkout with valid cart" tells you exactly what has broken when it goes red, and it survives refactors because it doesn't care about internal structure.

See [tests.md](tests.md) for examples and [mocking.md](mocking.md) for mocking guidelines.

## Seams: where tests go

A **seam** is the public boundary you test at: the interface where you observe behavior without reaching inside. Tests live at seams, never against internals.

Guard each risk boundary at the highest seam that reaches it, and prefer an existing seam to a new one.

When the shape of that interface is itself in question (how deep the module is, where the seam belongs, what the interface should expose), call the Skill tool with "codebase-design" for the vocabulary. It is the shared source of the module, interface, depth, seam, adapter, leverage and locality terms, and it is a reference to consult, not a session to run.

## Anti-patterns

- **Implementation-coupled**: mocks internal collaborators, tests private methods, or verifies through a side channel (querying the database instead of using the interface). The tell: the test breaks when you refactor but behavior hasn't changed.
- **Tautological**: the assertion recomputes the expected value the way the code does (`expect(add(a, b)).toBe(a + b)`, a snapshot derived by hand the same way, a constant asserted equal to itself), so it passes by construction and can never disagree with the code. Expected values must come from an independent source of truth: a known-good literal, a worked example, the spec.
- **Coverage padding**: tests for glue, passthroughs, or behavior that types or running the app already catch. The tell: you can't name the expensive failure the test prevents.

## Existing tests that break

When your change breaks an existing test, fix the test if it guards a risk boundary. Delete it if it is implementation-coupled, and list every deletion in your report.

---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---

Implement the work described by the user in the spec or tickets.

Verify each change by exercising it for real: a CLI call, a curl, a throwaway script, the running app. Delete throwaway checks; don't commit them.

Once a ticket's code works, call the Skill tool with "testing" and guard the risk boundaries it crosses. A ticket that crosses none gets no new test.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

Once done, call the Skill tool with "code-review" to review the work.

Commit your work to the current branch.

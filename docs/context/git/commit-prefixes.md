# Git commit prefixes

Canonical vocabulary for commit message prefixes used by the **good-commit** skill. Every commit message starts with one prefix in square brackets.

## Language

**Commit prefix**:
A square-bracket tag at the start of a commit subject line (e.g. `[fix]`) that classifies the change. Required on every commit; exactly one prefix per message.

**Changelog prefix**:
A prefix whose subject line is written for end users: `[feature]`, `[fix]`, or `[polish]`.

**Maintainer prefix**:
A prefix whose subject line is written for repo maintainers: `[docs]`, `[refactor]`, `[test]`, or `[chore]`.

**Feature** (`[feature]`):
A new capability the product did not have before.
_Avoid_: `[polish]` for net-new behavior; `[fix]` for restoring intended behavior.

**Fix** (`[fix]`):
Correcting behavior that is broken or regressed relative to intended behavior.
_Avoid_: `[polish]` for bug fixes; `[feature]` for intentional new behavior.

**Polish** (`[polish]`):
A UX, copy, or visual improvement with no new capability and nothing broken.
_Avoid_: `[feature]` for net-new behavior; `[fix]` when something is wrong.

**Docs** (`[docs]`):
Documentation-only changes (README, CONTEXT, ADRs, skill prose).
_Avoid_: `[chore]` for prose; `[polish]` for user-facing product copy in the app.

**Refactor** (`[refactor]`):
Restructuring code without changing external behavior.
_Avoid_: `[fix]` when behavior changes; `[polish]` for presentation-only tweaks.

**Test** (`[test]`):
Adding or updating tests without production code changes.
_Avoid_: bundling unrelated fixes in the same commit.

**Chore** (`[chore]`):
Tooling, dependencies, manifest updates, install scripts, and other repo hygiene.
_Avoid_: `[docs]` for documentation; `[refactor]` for application code moves.

## Relationships

- Every commit has exactly one **Commit prefix**
- **Changelog prefix** and **Maintainer prefix** are disjoint sets that partition all prefixes
- **Feature**, **Fix**, and **Polish** are the only **Changelog prefix** values
- When a change spans categories, pick the single most specific prefix; do not stack prefixes

## Example dialogue

> **Agent:** "I updated the install script and regenerated `manifest.json` — `[chore]` or `[refactor]`?"
> **Maintainer:** "`[chore]` — manifest and tooling. `[refactor]` is for application code structure."

> **Agent:** "I fixed a misleading button label — `[fix]` or `[polish]`?"
> **Maintainer:** "`[polish]` — nothing was broken. `[fix]` is for incorrect behavior."

## Related

- [Agent Skills (source repo)](../CONTEXT.md) — repo-wide skill and sync vocabulary
- `skills/git/good-commit/SKILL.md` — workflow that applies these prefixes

---
name: good-commit
description: For committing changes to git. Use when the user asks you to commit your work or commit your changes.
---

Stage and commit your changes to the current branch. Only stage files you changed in this agent session. Never push to the remote. Never create a pull request. Never create a new branch.

## One commit or several?

Before staging, review all changes. **Prefer multiple commits** when the diff mixes unrelated concerns — each commit should tell one story with one prefix.

Split when changes fall into distinct groups, for example:

- Feature or fix code separate from `[docs]` or `[chore]` updates
- `[refactor]` that enables a follow-up `[feature]` or `[fix]`
- `[test]` additions separate from the production code they cover
- Unrelated files touched in the same session (e.g. manifest update + skill content)

Keep a **single commit** when every file belongs to the same logical change (e.g. a new skill plus its manifest entry).

When splitting:

1. Order commits so each one stands alone — put foundational refactors or shared setup before dependents.
2. Stage only the files for the current group (`git add` specific paths, not `git add .` unless the whole diff is one group).
3. Commit with the matching prefix and message, then repeat until the working tree is clean.
4. Briefly tell the user how many commits you made and what each contains.

Do not split hairs — two tiny commits that always belong together (e.g. a function and its call site) can stay in one commit.

## Commit message format

Every commit message **must** start with a square-bracket prefix, then a space, then an imperative summary with the first word capitalized. No trailing period.

```
[prefix] Summary in imperative mood
```

Example: `[fix] Handle null session token`

## Prefixes

| Prefix | Use when | Tone |
| --- | --- | --- |
| `[feature]` | Adding a new capability | Changelog — write for end users |
| `[fix]` | Correcting broken behavior | Changelog — write for end users |
| `[polish]` | UX, copy, or visual tweak; no new capability and nothing broken | Changelog — write for end users |
| `[docs]` | Documentation only | Maintainer |
| `[refactor]` | Code structure change without behavior change | Maintainer |
| `[test]` | Tests only | Maintainer |
| `[chore]` | Tooling, deps, manifest, install scripts, repo hygiene | Maintainer |

When more than one prefix could fit, prefer the most specific match. Do not combine prefixes.

### Changelog tone (`[feature]`, `[fix]`, `[polish]`)

Write as a user-facing changelog line: outcome-focused, plain language, no internal jargon.

- `[feature] Add bulk export for saved views`
- `[fix] Restore tab state after refresh`
- `[polish] Improve contrast on disabled buttons`

### Maintainer tone (`[docs]`, `[refactor]`, `[test]`, `[chore]`)

Write for developers maintaining the repo.

- `[docs] Document commit prefix conventions`
- `[refactor] Extract sync validation into shared module`
- `[test] Add install manifest orphan tests`
- `[chore] Update manifest after skill install`

See [commit prefixes](../../../docs/context/git/commit-prefixes.md) for canonical definitions.

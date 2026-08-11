---
name: worktree-finalize
description: Finalizes completed work in the current Git worktree by creating a new branch, making clean commits, pushing the branch, and opening a pull request. Use when the user asks to finalize, publish, or open a PR for the current worktree.
disable-model-invocation: true
---

# Finalize a worktree

Publish the completed work in the current Git worktree on a new branch and open a pull request.

Commits should follow the good-commit skill standards.

## Workflow

1. Review the repository before changing Git state:
   - Inspect the current branch, worktree status, full diff, and recent commits.
   - Identify only the changes made in this agent session or explicitly included by the user.
   - Preserve unrelated changes; never discard, overwrite, or stage them.
   - Determine the pull request's base branch from repository context or the remote default branch.
   - Compare the current `HEAD` with that base. If inherited commits would contaminate the pull request and their ownership is unclear, stop and ask the user rather than rewriting history.
2. Create and switch to a new branch before staging. Use the repository's required branch prefix when one exists; otherwise use `codex/<short-kebab-case-description>`. Do not reuse or overwrite an existing local or remote branch.
3. Apply `good-commit` to the authorized changes:
   - Follow its review, scoping, commit-splitting, staging, prefix, and commit-message rules.
   - Its prohibitions on creating a branch, pushing, and opening a pull request do not apply here; this skill explicitly owns those publication steps.
   - Stage specific paths or hunks when the worktree contains unrelated changes.
4. Run verification proportionate to the change before publishing. At minimum, run `git diff --check` for the commits and inspect the final commit range against the base branch. Fix failures caused by the work when safe; report unrelated or unresolved failures clearly.
5. Push the new branch to the configured remote and set its upstream. Never force-push unless the user explicitly requests it.
6. Open a pull request against the chosen base branch. Create a ready pull request unless the user asks for a draft. Write a concise title and a body that includes:
   - A summary of the completed change
   - The verification performed and its outcome
   - Any known failures, limitations, or follow-up work
7. Confirm the result with the branch name, commit list, pull request link, verification outcome, and any unrelated worktree changes left untouched.

## Safety boundaries

- Never include secrets, credentials, generated local state, or unrelated user changes in commits or the pull request.
- Never bypass branch protection, disable checks, or rewrite shared history to make publication succeed.
- If authentication, remote permissions, or pull-request tooling is unavailable, leave the local branch and commits intact and report the exact blocker.

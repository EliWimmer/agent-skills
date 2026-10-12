---
name: finalize-worktree
description: "Merge completed worktree work into local main and remove its worktree and local branch."
disable-model-invocation: true
---

Finalize the task's linked worktree: integrate current local `main` into the task branch, validate there, fast-forward `main` to that verified commit, then clean up.

This is a local workflow. Use `refs/heads/main`; fetching, upstream synchronization, pushing, and PR operations require a separate request. Preserve existing commits. If repository rules require an incompatible history strategy, stop and ask rather than changing strategies.

## 1. Establish the source and target

Use `git worktree list --porcelain` to identify checkouts by branch, rather than assuming the original checkout holds `main`. Record the absolute source worktree path (`source_worktree`), task branch (`source_branch`), a surviving checkout, and any temporary checkout created by this run.

Confirm the source is the task's removable linked worktree. If it is ambiguous, detached, on `main`, or the original checkout, stop and ask. Check repository instructions for commit conventions, required validation, and history rules. Preserve any pre-existing merge, rebase, cherry-pick, or other unfinished Git operation; stop rather than taking it over.

Find the checkout of `refs/heads/main` (`main_worktree`). If none exists, create a temporary linked checkout of the existing local `main` in a fresh location outside the source directory. Keep its path for cleanup.

Require the target to have no tracked changes or untracked files and no unfinished Git operation. Check with explicit untracked-file visibility:

```sh
git -C "$main_worktree" status --porcelain=v1 --untracked-files=all --ignore-submodules=none
```

If the target is dirty, stop and preserve it. Ignored files may remain; the merge commands below protect them from being overwritten. Keep the target clean rather than stashing, committing, or discarding its changes.

Inventory source changes, including files that ordinary status can hide:

```sh
git -C "$source_worktree" status --porcelain=v1 --untracked-files=all --ignored --ignore-submodules=none
```

Review staged and unstaged changes and the commits destined for `main`. Commit changes clearly belonging to the completed task, staging only those paths. Leave unrelated changes in place and ask about ambiguous ownership or unrelated changes that prevent a clean source. Establish a clean source index and tracked files before merging. Classify untracked and ignored files using the cleanup rules in step 4; resolve valuable or ambiguous files before proceeding.

## 2. Integrate and validate in the source

Record the current local `main` commit as `main_tip` and merge that snapshot into the task branch:

```sh
git -C "$source_worktree" merge --ff --no-edit --no-autostash --no-overwrite-ignore "$main_tip"
```

Resolve conflicts when intent is clear from the task and existing code, preserving both the task and main's intended behavior. Ask when a resolution needs an unsettled product or design decision. Complete the merge and any necessary task commits before validation. Leave ambiguous conflicts in the source; `main` stays untouched.

Record the source commit as `prepared_tip`. Run the repository's required checks appropriate to the combined result in this worktree. Reuse earlier passing results only if they cover this exact commit. If checks produce tracked changes, review and commit task-owned changes, then validate the new commit. Failed or unavailable required checks block integration and cleanup.

This step is complete when the source branch and HEAD still point to `prepared_tip`, its index and tracked files are clean, no Git operation remains unfinished, and required checks have passed for that commit.

## 3. Fast-forward main to the verified commit

Immediately recheck that the target still holds `refs/heads/main`, is clean, and has no unfinished operation. Confirm the source branch and HEAD are unchanged since validation. Merge the recorded commit ID, rather than a branch name that could have moved:

```sh
git -C "$main_worktree" merge --ff-only --no-autostash --no-overwrite-ignore "$prepared_tip"
```

If `main` advanced and no longer permits this fast-forward, repeat step 2 against its new tip once, then retry this step. If `main` moves again, stop with the source intact. Other failures require diagnosing the cause; a dirty checkout, ignored-file collision, hook failure, or changed source is not a reason to repeat or bypass the safety checks.

If `main` already contains the verified commit, integration is already complete. Prove containment before cleanup:

```sh
git -C "$main_worktree" merge-base --is-ancestor "$prepared_tip" refs/heads/main
```

## 4. Clean up only what is safe to remove

Refresh worktree discovery, branch tips, and the source inventory. Require the source branch to remain at `prepared_tip`, its tracked files and index to be clean, and the containment check above to pass. New work blocks removal even if an earlier commit was merged.

Account for every untracked and ignored path before deleting its directory:

- Clearly reproducible dependencies, build output, and other disposable artifacts may be discarded. Inspect contents and provenance when classifying directories; ignored status alone does not establish disposability.
- Preserve valuable files such as local configuration, notes, or databases outside any directory being removed. Ask for a destination or decision when needed, and verify preservation before continuing.
- Any unresolved ownership, value, or preservation question blocks removal.

Remove explicitly identified disposable untracked artifacts if they block normal removal. Recheck the inventory after validation, since checks can create new files. A clean ordinary Git status does not account for ignored files, which worktree removal can delete.

Run cleanup from a surviving checkout, changing the session/tool working directory out of any directory being removed. Remove the source worktree with normal Git removal, then delete its local branch safely:

```sh
git -C "$main_worktree" worktree remove "$source_worktree"
git -C "$main_worktree" branch -d -- "$source_branch"
```

Recheck the branch tip and its containment in `main` immediately before branch deletion. `branch -d` also checks the configured upstream, so it may refuse even after integration into `main`. Treat refusal as incomplete cleanup; retain the branch rather than forcing deletion or changing its upstream to bypass the check.

Remove any temporary main checkout created by this run using the same inventory and normal-removal rules, running from another surviving checkout. Keep existing checkouts. Verify the removed paths are absent from `git worktree list --porcelain` and the task branch no longer exists.

## Completion and retries

Report the integrated commit, current local `main` commit, checks passed, removed worktrees and branch, preserved files and their destinations, and anything remaining.

If integration succeeds but cleanup fails, keep the successful integration and preserve the remaining resources. Report integration and cleanup separately, including the recorded paths, branch, and verified commit needed to retry. Resume from observed state: skip completed removals, reconfirm that `main` contains the verified commit and that remaining resources have no new work, then finish only the outstanding cleanup. If identity or validation evidence is missing, inspect or ask before continuing.

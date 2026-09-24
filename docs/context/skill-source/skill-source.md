# Skill source

The catalog of skills authored in this repository and the installer that deploys them to global tool directories.

## Language

**Skill source tree**:
The canonical copy of every skill in this repository, rooted at `skills/`.
_Avoid_: installed copy, destination tree

**Category folder**:
An optional one-level grouping under the skill source tree. Install flattens it away.
_Avoid_: nested skill path, installed category

**Skill folder name**:
The leaf directory name of a skill. Unique across the source tree and equal to that skill's `name`.
_Avoid_: category path, display title

**Install destination**:
A personal, global skills directory on this machine.
_Avoid_: project-local `.cursor/skills/`, `~/.cursor/skills-cursor/`

**Sync**:
A destination update that copies current source skills and leaves other destination folders alone.
_Avoid_: install

**Install manifest**:
The committed list of skill folder names this repository last deployed.
_Avoid_: skill catalog, package lock

**Install**:
A destination update that syncs, then removes this repository's orphans, then rewrites the install manifest.
_Avoid_: sync

**Uninstall**:
Removal of this repository's deployed skills from install destinations, by name or as orphans.
_Avoid_: delete from the source tree

**Create-new-global-skill**:
The repository-local skill under `.agents/skills/` that documents how to author skills in this repository's global catalog. It is not part of the **Skill source tree** and is not deployed by **Install**.
_Avoid_: author-new-skill

**Create-new-skill**:
The skill that documents how to author a project-local skill in an individual repository.
_Avoid_: skill catalog authoring

**Deprecated skill**:
A skill moved out of the skill source tree to `deprecated/`. Not synced.
_Avoid_: retired skill, archived skill, deleted skill

**Orphan**:
A skill folder name still on the install manifest and no longer in the skill source tree.
_Avoid_: stale install, leftover

## Relationships

- The **Skill source tree** contains many [Skills](../CONTEXT.md), optionally grouped in **Category folders**
- **Sync** copies each **Skill** into each **Install destination** as a flat sibling
- **Install destinations** are personal and global, not per-project checkouts
- **Install** is **Sync** plus **Orphan** cleanup via the **Install manifest**
- Only names on the **Install manifest** may be removed from an **Install destination**
- **Create-new-global-skill** is repo-local guidance, outside the **Skill source tree** and **Install manifest**
- **Create-new-skill** guides the authoring of a project-local **Skill** in its host repository
- A **Deprecated skill** is not in the **Skill source tree** and is not copied by **Sync**
- A **Deprecated skill** that remains on the **Install manifest** is an **Orphan** until **Install** or **Uninstall** runs
- Deprecating a skill leaves its name on the **Install manifest**. Do not edit the manifest by hand
- A **Deprecated skill** may return to the **Skill source tree** under the same **Skill folder name** if that name is still unique
- Renaming a skill is a new **Skill** plus a **Deprecated skill** of the old name. There is no rename operation and no manifest swap
- A third-party skill in an **Install destination** is not an **Orphan**

## Example dialogue

> **Dev:** "I added `skills/engineering/grill-with-docs/` — where does it show up after sync?"
> **Maintainer:** "As `grill-with-docs/` next to your other skills in each install destination, not under `engineering/`."

> **Dev:** "I moved a skill to `deprecated/`. Do I take it off the install manifest now?"
> **Maintainer:** "No. Leave the name. The next install treats it as an orphan, removes the destination copies, and drops the name."

> **Dev:** "Will sync remove that deprecated skill from `~/.cursor/skills/`?"
> **Maintainer:** "No. Sync never removes destination folders. Only install or uninstall does."

> **Dev:** "Can I move it back under `skills/` later?"
> **Maintainer:** "Yes, same folder name, if nothing else took it. The next install deploys it again."

> **Dev:** "I moved `create-new-global-skill` into `.agents/skills/`. Will catalog install keep deploying it?"
> **Maintainer:** "No. Install only discovers `skills/`. It removes the old deployed copies as an orphan and drops the name from the manifest."

## Flagged ambiguities

- **Create-new-global-skill** documents the global catalog's rules but lives locally in this repository. **Create-new-skill** guides project-local skill authoring in general.
- A skill taken out of the live catalog was called retired, archived, or deleted. Resolved: **Deprecated skill**.
- A leftover destination copy after a skill left the source tree. Resolved: **Orphan**. Only names on this repo's **Install manifest** qualify.
- Sync script named the Node wrappers. Resolved: implementation, not product language.
- Shared references were a family-wide inject at install. Resolved: not product language. The install hook may remain in code.

## Related

- [Git commit prefixes](../git/commit-prefixes.md) — used by the good-commit skill
- [ADR-0002](../../adr/0002-live-catalog-replaces-with-docs-family.md) — live catalog replaces the with-docs family

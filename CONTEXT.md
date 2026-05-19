# Agent Skills (source repo)

A personal source-of-truth repository for authoring agent skills and syncing them to tool-specific install locations.

## Language

**Skill**:
A directory containing a required `SKILL.md` plus optional supporting files; the unit that agents discover and load.

**Skill source tree**:
The canonical copy of all skills in this repo, rooted at `skills/`. Category subfolders (e.g. `planning/`) exist only for navigation; they are not part of installed layout.

**Category folder**:
An optional single subdirectory directly under `skills/` that groups related skills (e.g. `skills/planning/`). At most one category level is allowed between `skills/` and a skill directory; deeper nesting is invalid. Ignored when flattening to install destinations.

**Skill folder name**:
The leaf directory name under `skills/` (e.g. `grill-with-docs`). Must be unique across the entire source tree; duplicate leaf names under different category folders are invalid. Must match the `name` field in that skill's `SKILL.md` frontmatter; install and sync fail if they differ.

**Install destination**:
A personal, global skills directory on the machine (under the user home directory) where synced skills appear as sibling folders. Project-local paths (e.g. `.cursor/skills/`) are out of scope for v1. Default targets: `~/.agents/skills/`, `~/.cursor/skills/`, `~/.claude/skills/`, and `~/.gemini/skills/`. Never write to `~/.cursor/skills-cursor/`.

**Sync**:
Copying skill directories from the source tree into one or more install destinations, replacing each destination skill folder wholesale if it already exists. Sync never deletes destination folders for skills absent from the source tree (other tools may share the same install directories), and does not read or write `manifest.json`. Uses the same validation rules as **Install** before copying.

**Install manifest**:
A committed `manifest.json` at the repo root listing skill folder names this repository last deployed, used to remove only those skills during uninstall—not arbitrary third-party skills in the same directory. Schema: `{ "version": 1, "skills": ["...", ...] }` with a sorted `skills` array, rewritten on each `install`.

**Install**:
Runs sync, then uses the manifest to remove orphaned skills (previously deployed by this repo but no longer present in the source tree), then updates the manifest.

**Uninstall**:
Removes skill folders from install destinations when they were deployed from this repository—either explicitly by name or as orphans relative to the current source tree and manifest.

**Sync script**:
Cross-platform tooling (Node `.mjs` core with thin `*.sh` / `*.ps1` wrappers) that implements copy, install, and uninstall behavior.

**Create-skill skill**:
A tool-agnostic skill at `skills/meta/create-skill/` that documents how to author skills for this repository; installed like any other skill. Does not duplicate per-tool variants.

**Context**:
A bounded domain area with its own glossary (`CONTEXT.md`), vocabulary, and relationships. One repo may contain several contexts.

**CONTEXT-MAP.md**:
Root index listing each context, where its `CONTEXT.md` lives, and how contexts relate. Present when a repo has multiple contexts.

**Context-specific CONTEXT.md**:
A glossary colocated with its domain (e.g. `src/ordering/CONTEXT.md`), not the repo root. Holds terms for that context only.

**Root glossary**:
An optional root `CONTEXT.md` holding cross-cutting terms shared across contexts. Absent in most multi-context repos; `CONTEXT-MAP.md` is the root artifact instead.

**Shared terms**:
Cross-context vocabulary defined inline in `CONTEXT-MAP.md` under a Shared section, or in `docs/shared/CONTEXT.md` if the list grows large. Not kept in a root `CONTEXT.md` after a context split.

**Context split**:
Reorganising a bloated root `CONTEXT.md` into domain-specific glossaries plus a `CONTEXT-MAP.md`. Done via propose → confirm → execute; root `CONTEXT.md` is deleted after.

## Relationships

- The **Skill source tree** contains many **Skills**, optionally grouped in **Category folders**
- **Sync** copies each **Skill** from the source tree into each configured **Install destination** as a flat sibling (no category folders)
- v1 **Install destinations** are personal/global only, not per-project checkouts
- **Install** = **Sync** + orphan cleanup via the **Install manifest**; only skills tracked by this repo are eligible for removal

## Example dialogue

> **Dev:** "I added `skills/planning/grill-with-docs/` — where does it show up after sync?"
> **Maintainer:** "As `grill-with-docs/` next to your other skills in each install destination, not under `planning/`."
>
> **Dev:** "I deleted a skill from the repo—will sync remove it from `~/.cursor/skills/`?"
> **Maintainer:** "Sync alone won't touch it. Run install (which prunes orphans) or uninstall; only skills this repo previously installed are removed."

## Flagged ambiguities

(none)

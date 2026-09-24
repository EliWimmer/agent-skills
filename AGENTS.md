# Agent Skills

Personal source of truth for authoring skills and installing them to global tool directories. The engineering skills in the catalog are how this repo documents itself. They are not a second product.

## Read first

- [docs/context/CONTEXT-MAP.md](docs/context/CONTEXT-MAP.md) — contexts and how they relate
- [Skill source](docs/context/skill-source/skill-source.md) — catalog, install, deprecate, orphan
- [Create-new-global-skill](.agents/skills/create-new-global-skill/SKILL.md) — how to write a skill for this repo's global catalog
- [Create-new-skill](skills/meta/create-new-skill/SKILL.md) — how to write a project-local skill

## Work in this repo

For catalog skills, author under `skills/`, then run `./scripts/install.sh`. Repo-local guidance under `.agents/skills/` stays in this checkout and is not installed by the catalog. `deprecated/` is not live. Leave the install manifest alone when deprecating. The next install prunes orphans.

Use `domain-modeling` when language or decisions change. Use `ask-with-docs`, `fix-with-docs`, `grill-with-docs`, `research-with-docs`, and `document-process` for the matching jobs.

## Do not

- Copy glossary text into this file
- Treat `deprecated/` or `docs/adr/0001-*` as current
- Install into project-local `.cursor/skills/` or `~/.cursor/skills-cursor/`

Human install commands live in [README.md](README.md).

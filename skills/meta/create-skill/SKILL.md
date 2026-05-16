---
name: create-skill
description: Documents standards for authoring skills in this repository and when to create or update a skill. Use when creating a new skill, editing SKILL.md frontmatter, or asking how skills should be structured in the agent-skills source repo.
---

# Create skill

## Repository layout

Skills live under `skills/` in one of two shapes only:

```
skills/<skill-name>/SKILL.md
skills/<category>/<skill-name>/SKILL.md
```

- **Category folders** (e.g. `planning/`, `meta/`) are for navigation only; install flattens to `<skill-name>/` in each tool directory.
- **Skill folder names** must be unique across the entire tree (no duplicate leaf names in different categories).
- At most **one** category level; no `skills/a/b/c/` skill paths.

After authoring, run `scripts/install.sh` (or `install.ps1`) from the repo root to deploy and update `manifest.json`.

## Required files

Each skill is a directory with a required `SKILL.md`. Optional siblings:

```
my-skill/
├── SKILL.md
├── scripts/
├── references/
└── assets/
```

## SKILL.md frontmatter

Every `SKILL.md` must start with YAML frontmatter:

```markdown
---
name: my-skill-name
description: What the skill does and when the agent should use it. Third person; include trigger terms.
---
```

| Field | Rules |
|-------|--------|
| `name` | Lowercase letters, numbers, hyphens; 1–64 chars; **must match the parent folder name** |
| `description` | Non-empty; third person; state **what** it does and **when** to use it |

Optional: `disable-model-invocation: true` when the skill should load only when explicitly invoked.

## Description quality

Write for discovery, not marketing:

- Third person: "Processes Excel files…" not "I can help you…"
- Include concrete trigger phrases the user might say
- One line is fine if it covers what + when

## Body content

- Keep instructions concise; the agent is already capable
- Prefer step-by-step workflows for non-obvious procedures
- If the user supplies exact wording for the skill, copy it **verbatim** into `SKILL.md`
- Link large reference material as separate files under `references/` instead of bloating `SKILL.md`

## Validation

`scripts/sync` and `scripts/install` fail before copying if:

- Layout is invalid or folder names collide
- `SKILL.md` or required frontmatter is missing
- `name` in frontmatter ≠ folder name

## Checklist for a new skill

1. Pick a globally unique folder name under `skills/` or `skills/<category>/`
2. Add `SKILL.md` with matching `name` and a strong `description`
3. Run `./scripts/install.sh` and commit `manifest.json` with your changes
4. Invoke the skill in your agent to verify discovery

---
name: create-new-skill
description: Creates a project-local agent skill. Use when the user asks to add a skill to an application repository, project workflow, or local agent setup.
---

# Create a project-local skill

## Workflow

1. Read the target project's instructions and inspect existing skills, agent configuration, and skill-related documentation. Identify the project-owned skill location, supported tools, naming rules, and any local authoring or install process.
2. Check whether an existing skill should be extended. Agree on a new name only when needed. Make it unique within the target tool's discovery scope, follow the project's naming rules, and match the skill folder to its frontmatter `name`.
3. Write a concise `SKILL.md` with the host tool's required YAML frontmatter, usually including `name` and `description`. Write the description in third person, state what the skill does and when to use it, and include concrete trigger wording. Keep instructions focused on the work agents should perform. Preserve any exact wording the user supplies.
4. Add supporting files such as `references/`, `scripts/`, or `assets/` only when the skill needs them. Keep links valid relative to the skill directory.
5. Follow the project's local validation or activation process. When no validator exists, check the frontmatter, folder/name match, links, target location, and whether the intended agent tool can discover the skill.

## Project conventions

- Let the target project's `AGENTS.md`, existing skill examples, and tool configuration define the format and location. Common conventions differ between tools and repositories.
- Place project-specific skill sources in the target repository's documented skill location. In this repository, use `.agents/skills/create-new-global-skill/SKILL.md` for skills that belong in its global catalog.
- If the repository has no skill convention and the intended tool or location is unclear, ask which tool and project-local location the user wants before creating files.
- Use the host project's documented local install or validation command when one exists. Otherwise, verify the project-local skill files directly.

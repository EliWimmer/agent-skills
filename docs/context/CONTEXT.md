# Agent Skills

Cross-cutting terms for this repository. Product language for the catalog and installer lives in [Skill source](./skill-source/skill-source.md).

## Language

**Skill**:
A directory with a required `SKILL.md` plus optional supporting files. The unit agents discover and load.
_Avoid_: prompt, rule, agent instruction

## Relationships

- Every **Skill** in this repository belongs to the [Skill source](./skill-source/skill-source.md) context
- The **good-commit** skill applies [Git commit prefixes](./git/commit-prefixes.md)

## Flagged ambiguities

- Planning doc-system was treated as a first-class bounded context. Resolved: this repo has one product, the skill source and installer. That context is retired.

## Related

- [Skill source](./skill-source/skill-source.md) — catalog and installer
- [Git commit prefixes](./git/commit-prefixes.md) — vocabulary used by good-commit
- [AGENTS.md](../../AGENTS.md) — agent entry point

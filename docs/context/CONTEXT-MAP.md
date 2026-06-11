# Context Map

## Contexts

- [Agent Skills (source repo)](./CONTEXT.md) — skill authoring, sync, install, and repo layout
- [Git commit prefixes](./git/commit-prefixes.md) — commit message prefix vocabulary for good-commit
- [Planning doc-system](./planning-doc-system/glossary.md) — doc-aware planning skills, docs/ artifacts, shared references

## Relationships

- **Agent Skills → Git commit prefixes**: the **good-commit** skill in the source tree applies **Commit prefix** rules defined in the git context
- **Agent Skills → Planning doc-system**: the **with-docs** skill family reads and writes **docs/** artifacts defined in the planning doc-system glossary

## Audits

- [`*-with-docs` skill-set](../audits/2026_06_11-with-docs-skill-set.md) — drift, duplication, and lifecycle review of the doc-aware planning family

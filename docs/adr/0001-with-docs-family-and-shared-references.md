# Doc-aware planning family supersedes legacy planning skills

The `*-with-docs` skills under `skills/with-docs/` are the canonical doc-aware planning family. They read `docs/context/`, cross-link outputs into the doc graph, and share reference files injected at install time from `skills/with-docs/_shared_references/` into each skill's `references/` folder.

`exploration-phased-plan` and `implement-plan` are deprecated: they produce or execute plans without grounding in project glossaries, ADRs, or audits. They live under `deprecated/` (outside `skills/`) for reference only. Leave deprecated skill names in `manifest.json` until `install` runs — install removes destinations for manifest entries absent from `skills/`, then rewrites the manifest. Use `plan-with-docs` and `implement-with-docs` instead.

`research-and-document` was renamed to `research-with-docs` and moved into `skills/with-docs/` with the same doc-aware read and cross-link contract as the rest of the family.

Install and sync copy each skill from `skills/with-docs/<skill>/`, merge `_shared_references/` into `references/`, and rewrite `../_shared_references/` links to `./references/` in all files so installed skills are self-contained on machines without this source repo.

See also: [Planning doc-system glossary](../context/planning-doc-system/glossary.md)

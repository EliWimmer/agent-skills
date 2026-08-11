# Domain awareness

During codebase exploration, also look for existing documentation.

## Full docs layout

```
docs/
├── context/
│   ├── CONTEXT.md              ← cross-cutting terms only
│   ├── CONTEXT-MAP.md          ← index of bounded contexts (when more than one)
│   └── <bounded-context>/
│       └── <slug>.md
├── adr/
├── plans/
│   ├── <slug>.md
│   └── progress/
│       └── <slug>-progress.md
├── research/
│   └── YYYY_MM_DD-<slug>.md
└── audits/
    └── YYYY_MM_DD-<slug>.md
```

**Top-level `docs/context/CONTEXT.md`:** cross-cutting terms that span multiple bounded contexts or have no single owner.

**Sub-context files:** `docs/context/<subdir>/<slug>.md` — one cohesive glossary cluster per file. Subdirectories are semantic bounded-context names (kebab-case), not mirrors of `src/`.

Create files lazily — only when you have something to write. If `docs/context/` does not exist, create it when the first term is resolved. If no `docs/adr/` exists, create it when the first ADR is needed.

## Legacy context files

If the repo still uses the old layout (repo-root `CONTEXT.md`, nested `CONTEXT.md` under `src/`, etc.), read them as fallback but recommend [context-cleanup](../../planning/context-cleanup/SKILL.md) to migrate.

## Choosing the active glossary

**At session start:**

1. Read `docs/context/CONTEXT-MAP.md` if it exists
2. Infer the bounded context from the user's request, code paths, or feature area
3. If a matching sub-context file exists → use it as the **active glossary**
4. If unclear → ask one targeted question (use **AskQuestion** when available; see [ASK-QUESTION.md](./ASK-QUESTION.md))
5. If no map and no sub-contexts → use `docs/context/CONTEXT.md`
6. If `docs/context/` does not exist but a legacy root `CONTEXT.md` does → read the legacy file

**During the session (writes):**

- New terms go into the **active glossary**
- Cross-cutting terms go into `docs/context/CONTEXT.md`
- When a cluster of related terms clearly belongs in a separate bounded context → **mid-session split**: create `docs/context/<subdir>/<slug>.md`, add an entry to `CONTEXT-MAP.md`, move terms there, add `## Related` links, continue in the new file

**Cross-cutting vs sub-context:** cross-cutting terms appear without a single owner; sub-context terms only make sense inside one feature area.

**Conflict check:** scan top-level `docs/context/CONTEXT.md` and the active sub-context before adding a term — challenge duplicates and contradictions across files.

Glossary file structure: [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md). ADR rules: [ADR-FORMAT.md](./ADR-FORMAT.md).

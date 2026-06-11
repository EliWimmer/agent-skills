---
name: author-skill-with-docs
description: Documents how to author new *-with-docs skills for the agent-skills source repo — layout, frontmatter, shared references, read-docs contract, and cross-linking. Use when creating or extending a skill in skills/with-docs/, adding family shared references, or asking how with-docs skills should be structured.
argument-hint: "Skill name or authoring task"
---

# Author skill with docs

Standards for adding or extending skills in the `*-with-docs` family in **this repository** (`agent-skills`). These skills run against **target projects** that use `docs/`; this skill governs how the skill source is written here.

For general skill authoring (any category), see [author-new-skill](../../meta/author-new-skill/SKILL.md). For planning-doc vocabulary, see [planning doc-system glossary](../../../docs/context/planning-doc-system/glossary.md).

## When to create vs extend

**Extend an existing skill** when the workflow fits an current family member (ask, audit, fix, grill, implement, plan, research) and only needs clearer steps or examples.

**Create a new `*-with-docs` skill** when:

- The workflow is doc-aware (reads `docs/context/`, plans, ADRs, research, audits) but none of the existing skills own it
- The skill writes a new artifact type under `docs/` — coordinate with **planning-docs** and the [planning doc-system glossary](../../../docs/context/planning-doc-system/glossary.md) first; new artifact types are rare
- The user explicitly wants a slash-invoked family member (e.g. `/review-with-docs`)

**Do not** create a `*-with-docs` skill for target-repo work that does not read or write `docs/` — use a normal skill outside `skills/with-docs/`.

## Repository layout

```
skills/with-docs/
├── _shared_references/          ← family-wide refs (not a skill)
│   ├── ASK-QUESTION.md
│   ├── ADR-FORMAT.md
│   ├── CONTEXT-FORMAT.md
│   └── DOMAIN-AWARENESS.md
└── <verb>-with-docs/
    └── SKILL.md                  ← required; skill-specific refs optional
```

- **Folder name** must equal frontmatter `name` and match `<verb>-with-docs` (lowercase, hyphens).
- **Globally unique** across `skills/` — no duplicate leaf names in other categories.
- **Skill-specific** reference files live in the skill folder only when not shared by the whole family; install still injects `_shared_references/` into each skill's `references/`.

Install merges `_shared_references/` → `references/` and rewrites `../_shared_references/` → `./references/` in all copied files. See [ADR-0001](../../../docs/adr/0001-with-docs-family-and-shared-references.md).

## Frontmatter

```markdown
---
name: <verb>-with-docs
description: <What it does>. Use when the user invokes /<verb>-with-docs, <trigger phrases>.
argument-hint: "<Short hint for slash command>"
disable-model-invocation: true   # only when required — see below
---
```

| Field | Rule |
|-------|------|
| `name` | Must match folder name; pattern `<verb>-with-docs` |
| `description` | Third person; state **what** + **when**; include `/verb-with-docs` |
| `argument-hint` | **Required** — short label for the user's input |
| `disable-model-invocation` | `true` only for heavy, explicit-invocation workflows (**plan-with-docs**, **implement-with-docs**). Omit for ask/fix/grill/audit/research-style skills that may auto-attach. |

## Required body sections

Use this order. Omit only sections that truly do not apply; link shared content instead of copying it.

```markdown
# <Title with docs>

<One paragraph: goal, primary input, primary output.>

## Asking the user

Ask **one question at a time**. Use **AskQuestion** when available;
follow [ASK-QUESTION.md](../_shared_references/ASK-QUESTION.md).
Clarifying vs grill — same contract as siblings.

## Read docs first

Full `docs/` layout tree (context, adr, plans, progress, research, audits).
Numbered read pass binding user input to artifacts.
Point to [DOMAIN-AWARENESS.md](../_shared_references/DOMAIN-AWARENESS.md) for **Choosing the active glossary** — do not paste that block.
Legacy CONTEXT.md fallback one-liner.

## Domain awareness

See [DOMAIN-AWARENESS.md](../_shared_references/DOMAIN-AWARENESS.md).

## <Skill-specific workflow>

… diagnose / explore / write / implement — the unique work …

## When to grill

Default to executing. Switch to grill only when glossary conflict, ambiguous scope,
doc/code authority clash, or ADR violation would produce the wrong outcome.
Link [grill-with-docs](../grill-with-docs/SKILL.md) and ASK-QUESTION.md.

## Cross-link …           # when the skill writes under docs/
## Quality bar             # recommended
## Examples                # recommended
```

**Never** paste the domain-awareness / active-glossary block into `SKILL.md` — that is why `_shared_references/DOMAIN-AWARENESS.md` exists.

## Shared references

| File | Use |
|------|-----|
| [ASK-QUESTION.md](../_shared_references/ASK-QUESTION.md) | All user questions |
| [DOMAIN-AWARENESS.md](../_shared_references/DOMAIN-AWARENESS.md) | Layout, legacy paths, active glossary |
| [CONTEXT-FORMAT.md](../_shared_references/CONTEXT-FORMAT.md) | Writing/updating glossaries; CONTEXT-MAP section order |
| [ADR-FORMAT.md](../_shared_references/ADR-FORMAT.md) | Offering ADRs during grill/fix/grill sessions |

**Add to `_shared_references/`** only when **every** family skill needs the same content. Otherwise keep refs in one skill's folder.

After changing `_shared_references/`, run `./scripts/install.sh` — all installed skills get the update on next install.

## Read-docs contract

Every consumer skill must list **all** governing areas in **Read docs first**:

- `docs/context/` (CONTEXT-MAP, glossaries)
- `docs/adr/`
- `docs/plans/` + `docs/plans/progress/`
- `docs/research/`
- `docs/audits/`

If the skill writes a new artifact type, also update [planning-docs](../../planning/planning-docs/SKILL.md) layout table and read pass so **planning-docs** and **fix-with-docs** load it before code changes.

## Cross-linking outputs

When the skill writes under `docs/`:

1. **CONTEXT-MAP.md** — add one line under the correct section (**Plans**, **Audits**, **Research** — order per [CONTEXT-FORMAT.md](../_shared_references/CONTEXT-FORMAT.md))
2. **Relevant glossaries** — `## Related` (3–6 links max)
3. **ADRs / plans / audits** — reciprocal "See also" only when it helps future readers

Do not duplicate artifact bodies into CONTEXT-MAP or glossaries.

## Grill and glossary writes

Skills that resolve terminology during a session (grill, fix, plan) may **update the active glossary inline** using [CONTEXT-FORMAT.md](../_shared_references/CONTEXT-FORMAT.md). Offer ADRs per [ADR-FORMAT.md](../_shared_references/ADR-FORMAT.md) — all three criteria must hold.

## Checklist for a new family skill

1. Confirm no existing sibling already owns the workflow
2. Create `skills/with-docs/<verb>-with-docs/SKILL.md` with frontmatter and sections above
3. Link `../_shared_references/` — never `../grill-with-docs/` for shared files
4. If writing new `docs/` artifact types → update **planning-docs** + planning doc-system glossary
5. Add skill name to `manifest.json` (sorted array)
6. Run `./scripts/install.sh`; verify installed skill has `references/` with shared files
7. Add an **Examples** pair (user message → agent outcome) in `SKILL.md`
8. Cross-link from [planning doc-system glossary](../../../docs/context/planning-doc-system/glossary.md) `## Related` if the skill is a permanent family member

## Validation

`scripts/sync` and `scripts/install` fail if:

- Folder name ≠ frontmatter `name`
- Duplicate skill name elsewhere under `skills/`
- Missing `SKILL.md` or required frontmatter

Run `node --test scripts/lib.test.mjs` after changing install injection behavior.

## Examples

**User:** "Add a `/review-with-docs` skill that writes PR reviews to `docs/reviews/`"
**Agent:** Challenge new artifact type → update planning-docs + glossary first → scaffold `skills/with-docs/review-with-docs/SKILL.md` → manifest → install.

**User:** "Add a shared REFERENCE.md for audit severity levels"
**Agent:** Add `skills/with-docs/_shared_references/AUDIT-SEVERITY.md` → link from audit-with-docs and author checklist → install.

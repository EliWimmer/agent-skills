# agent-skills

Single source of truth for personal agent skills. Author skills here, then install them to tool-specific directories on your machine.

## Layout

```
skills/
├── meta/
│   └── create-skill/       # Authoring standards
├── planning/
│   ├── grill-with-docs/
│   ├── exploration-phased-plan/
│   └── implement-plan/
└── <category>/<skill>/     # or skills/<skill>/ at repo root
    └── SKILL.md
manifest.json               # Skills last deployed by install (committed)
scripts/                    # sync / install / uninstall
```

Allowed paths: `skills/<skill>/` or `skills/<category>/<skill>/` only.

## Requirements

- [Node.js](https://nodejs.org/) 18+ (for `fs.cp` and the sync core)

## Commands

### macOS / Linux

```bash
chmod +x scripts/*.sh   # once

./scripts/sync.sh       # Copy skills to all destinations; no manifest or deletes
./scripts/install.sh    # Sync + remove orphans tracked in manifest + update manifest.json
./scripts/uninstall.sh <skill-name>   # Remove named skills from destinations + manifest
./scripts/uninstall.sh --all          # Remove every skill listed in manifest.json
```

### Windows (PowerShell)

```powershell
.\scripts\sync.ps1
.\scripts\install.ps1
.\scripts\uninstall.ps1 grill-with-docs
.\scripts\uninstall.ps1 --all
```

### Direct (any OS)

```bash
node scripts/lib.mjs sync
node scripts/lib.mjs install
node scripts/lib.mjs uninstall --all
```

## Install destinations

Each command copies skills (flat, by folder name) to:

| Path |
|------|
| `~/.agents/skills/` |
| `~/.cursor/skills/` |
| `~/.claude/skills/` |
| `~/.gemini/skills/` |

`~/.cursor/skills-cursor/` is never touched (Cursor-managed built-ins).

Other skills you installed separately in those folders are left alone. Only names listed in `manifest.json` are removed during `install` (orphans) or `uninstall`.

## Typical workflow

1. Add or edit a skill under `skills/`
2. `./scripts/install.sh`
3. Commit skill changes and the updated `manifest.json`

Use `sync` when you want to push copies without updating the manifest or pruning removed skills.

## Domain language

See [docs/context/CONTEXT.md](./docs/context/CONTEXT.md) for glossary terms used in this repo.

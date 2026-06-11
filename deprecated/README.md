# Deprecated skills

Skills moved here are **not installed or synced**. They remain in the repo for historical reference only.

## Deprecation workflow

1. Move the skill folder from `skills/` to `deprecated/<skill-name>/`.
2. Update the skill's `description` to point at the `*-with-docs` successor.
3. **Leave the skill name in `manifest.json`** until someone runs `./scripts/install.sh` — install removes skills that are in the manifest but absent from `skills/`, then rewrites the manifest without them.

Do not delete manifest entries manually when deprecating; that leaves orphaned copies in install destinations.

## Current contents

| Skill | Successor |
|-------|-----------|
| `exploration-phased-plan` | `plan-with-docs` |
| `implement-plan` | `implement-with-docs` |

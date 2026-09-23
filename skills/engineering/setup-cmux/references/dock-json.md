# Project dock.json

Canonical docs: https://cmux.com/docs/dock

## Where the file lives

cmux reads Dock config in this order:

1. `.cmux/dock.json` for the current repo, nearest parent, and nested project directories
2. `~/.config/cmux/dock.json` for a personal default

The project file wins when both exist. Nested project files apply to their directory tree. If neither file exists, Dock opens empty.

Write shared controls in the project file. Write personal or machine-specific controls in the global file only when the user asks.

## Seed, not overlay

`dock.json` seeds a Dock that has no saved snapshot. A restored session, including an empty snapshot, wins over the file. Reloading Dock config still replaces the current Dock with the file contents.

Project Docks start commands. cmux asks for trust before launching them. Changing the file changes the trust fingerprint.

## Schema

Top-level object with a `controls` array.

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | Stable, lowercase, unique. Do not reuse an id for a different command. |
| `title` | yes | Dock header label. |
| `type` | no | `terminal` (default) or `browser`. |
| `command` | terminal | Runs in the user's login shell. |
| `url` | browser | Page to embed. |
| `chrome` | no | Browser chrome. Default true. `false` hides the address bar and toolbar. |
| `cwd` | no | Relative paths resolve from the project directory that contains `.cmux`. |
| `height` | no | Points. Controls without a height share the leftover space. |
| `env` | no | Non-secret values for that control only. |

Relative `cwd` for a project file is the directory that contains `.cmux`, not `.cmux` itself.

## What to put in a project Dock

Pick controls the repo actually has.

- Git: `lazygit` if the project already uses it, otherwise a short status loop
- Tests: the real watch script from package.json or the Makefile
- Logs: `tail -f` only when that path is a documented project log
- Services: queues, compose status, or a TUI the README already names
- Browser: a local dashboard the repo serves, with `chrome: false` when the page is a sidebar

A looping `git status` control is fine. Prefer a real TUI when one is already in the toolchain.

Do not invent `cmux feed tui --opentui` unless the user uses cmux Feed. Do not put secrets, tokens, or `/Users/...` paths in a shared file.

## Example

```json
{
  "controls": [
    {
      "id": "git-status",
      "title": "Git",
      "command": "while true; do clear; git status --short --branch; echo; git log --oneline -8; sleep 10; done",
      "height": 220
    },
    {
      "id": "tests",
      "title": "Tests",
      "command": "npm test -- --watch",
      "height": 260
    },
    {
      "id": "preview",
      "title": "Preview",
      "type": "browser",
      "url": "http://127.0.0.1:5173",
      "chrome": false
    }
  ]
}
```

---
name: setup-cmux
description: Sets up project-local cmux configuration under .cmux/. Use when the user asks to configure cmux, add a workspace layout, write cmux.json or dock.json, or set up Dock controls for a repo.
---

# Set up cmux

Write a project-local `.cmux/` that teammates can share. A project that only pins a few scripts to the tab bar is unfinished. The useful pieces are a default workspace layout for the real dev loop and a Dock that shows the repo's live state.

Project `.cmux/cmux.json` can set actions, commands, UI action wiring, notification hooks, Agent Chat, Vault agents, and workspace-group overrides. It cannot set global app preferences. Those stay in `~/.config/cmux/cmux.json`.

## 1. Refresh the live docs

Run `cmux docs custom-commands` and `cmux docs dock` if the CLI is available. If it is not, read:

- https://cmux.com/docs/custom-commands
- https://cmux.com/docs/dock
- https://cmux.com/docs/configuration

Treat those pages as current. This skill's field lists are a fallback. Built-in action IDs live in [built-in-commands.md](references/built-in-commands.md). If that file and the live `CmuxSurfaceTabBarBuiltInAction` enum disagree, use the enum.

This step is complete when the action types, layout tree, and Dock fields match the live docs.

## 2. Inspect the project

Read existing `.cmux/cmux.json`, `.cmux/dock.json`, and a root `cmux.json` if one still exists. Prefer `.cmux/` for new work. Leave a legacy root file only when the user wants it kept.

Then read the repo the way a new teammate would: package scripts, Makefile, Justfile, Procfile, Cargo/Tauri tasks, compose files, README, log paths, test watchers, and any TUI already in the toolchain. Do not invent scripts.

This step is complete when you can name the primary dev loop, the frequent one-shot commands, and the live status that belongs in the Dock.

## 3. Ask before guessing

Ask when any of these are true:

- more than one primary app or package could own the default workspace
- the live preview URL or port is not in the repo
- an existing `.cmux/` already has useful entries and the user did not say to replace them
- the user asked only for Dock or only for actions

Preserve existing useful entries unless the user asked to replace them.

This step is complete when the default workspace, tab-bar actions, and Dock controls are agreed or obvious from the repo.

## 4. Write `.cmux/cmux.json`

Create or update `.cmux/cmux.json` at the project root. Put `$schema` and `"schemaVersion": 1` at the top.

```json
{
  "$schema": "https://raw.githubusercontent.com/manaflow-ai/cmux/main/web/data/cmux.schema.json",
  "schemaVersion": 1
}
```

A complete project file usually has all four:

1. **Workspace layout.** One `workspace` action, or a `commands` entry plus a `workspaceCommand` action, for the primary loop. Typical shape: app terminal, optional second process, optional browser preview. Set `ui.newWorkspace.action` to that layout when New Workspace should open it.
2. **Command actions.** Frequent, safe scripts on the tab bar and in Command Palette. Destructive work (`clean`, `reset`, `migrate`) gets `"confirm": true`.
3. **Tab-bar wiring.** `ui.surfaceTabBar.buttons` replaces the default list when present. Put project actions first, then the built-ins. Always. Keep `cmux.splitRight` and `cmux.splitDown` unless the user wants them gone. Leave out a built-in ID to hide it.
4. **Palette commands.** Extra `commands` entries for tests, generate, or one-shot chores that do not need a button.

Read [cmux-json.md](references/cmux-json.md) before writing actions, layouts, or UI wiring. Read [built-in-commands.md](references/built-in-commands.md) before wiring tab-bar or plus-button IDs.

Portable commands only. Resolve the repo with `git rev-parse --show-toplevel` or a relative `cwd`. Never write a machine home path such as `/Users/...`. Never put secrets in the file.

The `actions` registry is a nightly feature. If the user is not on nightly, keep layouts and one-shot work under `commands` and say so.

This step is complete when the file parses, every action ID is unique, every button points at a real action, and no command depends on one machine.

## 5. Write `.cmux/dock.json`

Create or update `.cmux/dock.json` with a `controls` array. Shared project controls go here. Personal controls go in `~/.config/cmux/dock.json` only after the user asks for a personal Dock.

Prefer controls that stay useful while a workspace is open:

- git status or `lazygit` when that binary is in the toolchain
- the project's test watcher
- a log tail only when the file actually exists or the command creates it
- a browser control for a local dashboard the repo already serves

Read [dock-json.md](references/dock-json.md) before writing controls.

This step is complete when every control has a stable unique `id`, every terminal has a real command, every browser has a real URL, and nothing secret or machine-specific is in the file.

## 6. Validate and report

Parse both JSON files. `cmux.json` allows comments and trailing commas; strict `JSON.parse` will reject those. Prefer strict JSON so a normal parser can check the file. If you used comments or trailing commas, confirm the file by inspection.

If `cmux` is on `PATH`, tell the user to run `cmux reload-config` or press Cmd+Shift+, .

Report:

- which files you wrote
- what each action, workspace, and Dock control does
- commands they should review before trusting the project config
- that the first run prompts for trust, and that changing a command changes the trust fingerprint

The setup is complete when both files parse, the default workspace matches the project's real loop, and the user knows what they are about to trust.

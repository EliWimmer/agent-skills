# Project cmux.json

Canonical docs: https://cmux.com/docs/custom-commands and https://cmux.com/docs/configuration

Schema: https://raw.githubusercontent.com/manaflow-ai/cmux/main/web/data/cmux.schema.json

## Where the file lives

| Location | Role |
| --- | --- |
| `.cmux/cmux.json` | Project file. Write here. |
| `./cmux.json` | Legacy root file. Still read. Do not create new ones. |
| `~/.config/cmux/cmux.json` | Global. Fills in IDs the project does not define. |

Local actions and commands override global entries with the same ID or name. A schema error falls back to the next valid file and shows a Command Palette row that opens the broken file.

Reload with `cmux reload-config` or Cmd+Shift+, .

Project files may set `actions`, `commands`, `ui`, `notifications.hooks`, `notifications.hooksMode`, `agentChat`, `vault`, and `workspaceGroups.byCwd`. Do not put `app`, `terminal`, `browser`, `shortcuts`, or other `x-cmux-scopes: global` keys in a project file.

## Actions

`actions` maps stable IDs to runnable behavior. Use them when the same thing should appear on the tab bar, in Command Palette, on a shortcut, or in the plus-button menu. Keep `commands` for named shell one-shots and for workspace definitions that a `workspaceCommand` action will call.

| Type | What it does |
| --- | --- |
| `builtin` | Alias a built-in action ID. Full list: [built-in-commands.md](built-in-commands.md). |
| `command` | Run shell text. `target` is `currentTerminal` or `newTabInCurrentPane` (default). |
| `agent` | Start a coding agent CLI in a new tab. Any binary name works. |
| `workspaceCommand` | Run a named entry from `commands`. |
| `workspace` | Inline workspace definition. Offered in the plus-button menu unless `newWorkspaceMenu` is false. |

Shared fields: `title`, `subtitle` (`description` is an alias), `keywords`, `palette` (default true), `shortcut` (`cmd+shift+c` or `["cmd+k", "cmd+c"]`), `confirm`, `newWorkspaceMenu`, `icon`.

Icons are always objects:

```json
{ "type": "symbol", "name": "hammer" }
{ "type": "emoji", "value": "🧪", "scale": 0.9 }
{ "type": "image", "path": "./icons/codex.svg" }
```

Image paths are relative to the config file. Overriding a built-in ID such as `cmux.newTerminal` changes that shared entrypoint.

## Commands

Simple command: runs in the focused terminal's cwd.

```json
{
  "name": "Run Tests",
  "keywords": ["test", "check"],
  "command": "npm test",
  "confirm": true
}
```

If the command needs the repo root, prefix with `cd "$(git rev-parse --show-toplevel)" &&`.

Workspace command: opens a new workspace with a layout.

```json
{
  "name": "Dev Environment",
  "workspace": {
    "name": "Dev",
    "cwd": ".",
    "color": "#3b82f6",
    "env": { "NODE_ENV": "development" },
    "setup": "git fetch --all --prune",
    "layout": { "direction": "horizontal", "split": 0.5, "children": [] }
  }
}
```

Workspace fields: `name`, `cwd`, `color`, `env`, `setup`, `layout`. `setup` is sent to the first terminal before that terminal's own command.

Restart on a `workspace` action: `new` (default), `ignore`, `recreate`, `confirm`.

## Layout tree

Split node: `direction` is `horizontal` or `vertical`, `split` is 0.1 to 0.9 (default 0.5), `children` is exactly two nodes.

Pane node: `{ "pane": { "surfaces": [ ... ] } }`.

Surface: `type` is `terminal` or `browser`. Shared: `name`, `cwd`, `env`, `focus`. Terminal adds `command`. Browser adds `url`.

cwd resolution: `.` or omitted uses the workspace cwd, `./subdir` is relative to it, `~/path` expands home, absolute paths are used as-is. Prefer `.` and `./subdir`.

`CMUX_WORKSPACE_ID` and `CMUX_SURFACE_ID` are set in cmux terminals. Use them when sibling panes need a shared state file.

## UI wiring

`ui.surfaceTabBar.buttons` is a list of action IDs or button objects. Put project actions first, then the built-ins. Always.

```json
{
  "action": "start-dev",
  "title": "Dev"
}
```

A button object is for a different surface label, icon, or tooltip. The resolved title is also the trust prompt title.

`ui.newWorkspace.action` is the plus-button default. A project value wins over the global one. `ui.newWorkspace.contextMenu` (alias `rightClick`) is the ordered right-click menu. Entries are action IDs, action objects, or `{ "type": "separator" }`.

`newWorkspaceCommand` and `surfaceTabBarButtons` are legacy. Do not write them.

## Notification hooks

Only add these when the user asked. Hooks receive notification policy JSON on stdin and print updated JSON on stdout.

```json
{
  "notifications": {
    "hooksMode": "append",
    "hooks": [
      {
        "id": "mute-subagent-completions",
        "command": "if [ \"${CMUX_NOTIFICATION_AGENT_IS_SUBAGENT-0}\" = \"1\" ] && [ \"$CMUX_NOTIFICATION_AGENT_CATEGORY\" = \"turn-complete\" ]; then printf '{\"effects\":{\"desktop\":false,\"sound\":false,\"paneFlash\":false}}'; fi"
      }
    ]
  }
}
```

`hooksMode` is `append` (default) or `replace`. Project hooks use the same trust prompt as other project commands. Docs: https://cmux.com/docs/notifications

## Less common project keys

Write these only when the user asked:

- `agentChat`: local Agent Chat URL and optional `startCommand`
- `vault.agents`: extra JSONL-backed agents Vault can detect and resume
- `workspaceGroups.byCwd`: per-cwd group color, SF Symbol, plus-button menu, and placement

## Trust

Project-local actions appear immediately. The first run still prompts for trust. Trust is per exact action fingerprint, not per repo. Changing the command string asks again. Image icons stay locked until that action is trusted.

## Example

More than a tab-bar of scripts. This is the shape to aim for.

```json
{
  "$schema": "https://raw.githubusercontent.com/manaflow-ai/cmux/main/web/data/cmux.schema.json",
  "schemaVersion": 1,
  "actions": {
    "dev-layout": {
      "type": "workspace",
      "title": "Dev",
      "icon": { "type": "symbol", "name": "play.circle" },
      "restart": "confirm",
      "workspace": {
        "name": "Dev",
        "cwd": ".",
        "layout": {
          "direction": "horizontal",
          "split": 0.55,
          "children": [
            {
              "pane": {
                "surfaces": [
                  {
                    "type": "terminal",
                    "name": "App",
                    "command": "npm run dev",
                    "focus": true
                  }
                ]
              }
            },
            {
              "direction": "vertical",
              "split": 0.6,
              "children": [
                {
                  "pane": {
                    "surfaces": [
                      {
                        "type": "browser",
                        "name": "Preview",
                        "url": "http://localhost:5173"
                      }
                    ]
                  }
                },
                {
                  "pane": {
                    "surfaces": [
                      { "type": "terminal", "name": "Shell" }
                    ]
                  }
                }
              ]
            }
          ]
        }
      }
    },
    "test": {
      "type": "command",
      "title": "Test",
      "command": "npm test",
      "target": "newTabInCurrentPane",
      "icon": { "type": "symbol", "name": "checkmark.circle" }
    },
    "clean": {
      "type": "command",
      "title": "Clean",
      "command": "npm run clean",
      "target": "currentTerminal",
      "confirm": true,
      "palette": false,
      "icon": { "type": "symbol", "name": "trash" }
    }
  },
  "ui": {
    "newWorkspace": { "action": "dev-layout" },
    "surfaceTabBar": {
      "buttons": [
        "dev-layout",
        "test",
        "clean",
        "cmux.newTerminal",
        "cmux.newBrowser",
        "cmux.splitRight",
        "cmux.splitDown"
      ]
    }
  },
  "commands": [
    {
      "name": "Typecheck",
      "keywords": ["tsc", "types"],
      "command": "npm run check"
    }
  ]
}
```

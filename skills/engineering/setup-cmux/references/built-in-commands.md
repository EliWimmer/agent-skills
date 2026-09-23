# Built-in cmux commands

These are the action IDs cmux ships. Use them in `actions`, `ui.surfaceTabBar.buttons`, and `ui.newWorkspace.contextMenu`. Prefer the canonical `cmux.*` form.

Source of truth is `CmuxSurfaceTabBarBuiltInAction` in manaflow-ai/cmux. If this list and that enum disagree, use the enum:

https://github.com/manaflow-ai/cmux/blob/main/Sources/CmuxSurfaceTabBarBuiltInAction.swift

## IDs

| ID | What it does | Default shortcut |
| --- | --- | --- |
| `cmux.newWorkspace` | New workspace | Cmd+N |
| `cmux.newAgentChat` | New agent chat | none |
| `cmux.cloudvm` | Open Base (cloud VM) | none |
| `cmux.newCloudWorkspace` | New workspace on the remembered Cloud machine | Cmd+Shift+Y |
| `cmux.newCloudMachine` | Open the New Cloud Machine flow | Cmd+Y |
| `cmux.mobileconnect` | Open mobile pairing | none |
| `cmux.newTerminal` | New terminal tab in the current pane | Cmd+T |
| `cmux.newBrowser` | New browser tab in the current pane | Cmd+Shift+L |
| `cmux.newSimulator` | New simulator pane | none |
| `cmux.splitRight` | Split the current pane right | Settings |
| `cmux.splitDown` | Split the current pane down | Settings |

Shortcuts come from Settings or `shortcuts.bindings`. A rebind or unbind shows up the next time a menu opens. Cloud rows only appear when Cloud Machines is enabled.

`type: "builtin"` aliases one of these IDs. Overriding a built-in ID in `actions` replaces that shared entrypoint (palette, shortcut, tab bar, plus menu).

## Default placements

Default `ui.surfaceTabBar.buttons`:

- `cmux.newTerminal`
- `cmux.newBrowser`
- `cmux.splitRight`
- `cmux.splitDown`

Default plus-button menu when `ui.newWorkspace.contextMenu` is unset:

- `cmux.newWorkspace`
- `cmux.newCloudWorkspace`
- `cmux.newCloudMachine`
- `cmux.newTerminal`
- `cmux.newBrowser`

`ui.surfaceTabBar.buttons` replaces the default list when present. Leave an ID out to hide it. Keep the split buttons unless the user wants them gone. Put project actions before the built-in IDs. Always.

## Wiring

Tab bar or plus-button entry:

```json
"cmux.newBrowser"
```

Same action with a different label:

```json
{ "action": "cmux.newBrowser", "title": "Browser" }
```

Alias under a custom ID:

```json
{
  "type": "builtin",
  "builtin": "cmux.splitRight",
  "title": "Split"
}
```

## Aliases

Write the canonical ID. The loader also accepts the unprefixed camelCase form (`newBrowser`, `splitRight`) and these extras:

| Canonical | Also accepted |
| --- | --- |
| `cmux.newAgentChat` | `cmux.agentChat`, `new-agent-chat`, `agentChat` |
| `cmux.cloudvm` | `cmux.cloudVM`, `cmux.newCloudVM`, `cmux.startCloudVM`, and the same without `cmux.` |
| `cmux.mobileconnect` | `cmux.mobileConnect`, `cmux.connectPhone`, `connectPhone` |
| `cmux.newSimulator` | `new-simulator`, `simulator` |

---
name: cmux-computer-use
description: Drives native macOS applications and visual controls through the cmux Computer Use engine (cmux-cua). Use when the user asks to use cmux Computer Use, automate native macOS GUI apps, click or type in desktop apps from cmux, inspect accessibility trees, or capture app window screenshots.
---

# Drive macOS apps with cmux Computer Use

cmux bundles a local computer-use engine (`cmux Computer Use`, powered by `cmux-cua`). It operates native macOS applications by reading their accessibility trees, capturing window screenshots, and dispatching clicks, keystrokes, and gestures.

Do not invoke this skill, start the helper, or interact with GUI apps when the user is only asking about or discussing Computer Use. Wait for an explicit request to drive an application.

## Prerequisites

The helper requires two macOS system permissions, granted to `cmux Computer Use` (not the terminal or the main cmux app):

1. **Accessibility** (`AXIsProcessTrusted`)
2. **Screen Recording** (`CGPreflightScreenCaptureAccess`)

These permissions are configured in macOS **System Settings > Privacy & Security** or via cmux **Settings > Computer Use**.

## Architecture and connection details

The cmux Computer Use engine consists of:

- **Daemon helper app**: `/Applications/cmux.app/Contents/Library/cmux Computer Use.app/Contents/MacOS/cmux-cua` (runs as a service under your user session).
- **Client CLI binary**: `/Applications/cmux.app/Contents/Resources/bin/cmux-cua`.
- **Unix domain socket**: Auto-created at `/var/folders/.../cmux-cua-<uid>/com.cmuxterm.app/cmux-cua.sock` or `/tmp/cmux-cua-<uid>/default/cmux-cua.sock`.
- **Auth token**: Auto-created beside the socket at `.../com.cmuxterm.app/auth-token`.

Direct CLI invocations like `cmux-cua call ...` fail with exit code 78 (`TCC-protected commands belong to cmux Computer Use`). To drive applications, you must start `cmux-cua` in MCP mode over stdio (`cmux-cua mcp --socket <socket_path>`) with proxy environment variables set.

### Required environment variables for MCP

```sh
CMUX_CUA_MCP_FORCE_PROXY="1"
CMUX_CUA_EXTERNAL_PERMISSION_FLOW="1"
CMUX_CUA_SOCKET_AUTH_TOKEN="<token from auth-token file>"
CMUX_CUA_DEFAULT_SESSION="cmux-${CMUX_SURFACE_ID:-$$}"
CMUX_CUA_STATE_OWNER_PID="$$"
CMUX_CUA_CURSOR_GRADIENT="#12c7f5,#2d8cff,#6c5cff"
CMUX_CUA_CURSOR_BLOOM="#2d8cff"
CMUX_CUA_CURSOR_LABEL="cmux"
```

## Standard workflow

### 1. Locate socket and token

Find the active socket and auth token for your user ID (`id -u`):

- Token: search `/var/folders/*/*/*/cmux-cua-$(id -u)/com.cmuxterm.app/auth-token` or `/tmp/cmux-cua-$(id -u)/*/auth-token`.
- Socket: search `/var/folders/*/*/*/cmux-cua-$(id -u)/com.cmuxterm.app/cmux-cua.sock` or `/tmp/cmux-cua-$(id -u)/*/cmux-cua.sock`.

### 2. Connect via MCP

Spawn `/Applications/cmux.app/Contents/Resources/bin/cmux-cua mcp --socket <socket_path>` with the environment variables listed above. Send the MCP `initialize` request.

Alternatively, import or execute the bundled Python helper script:

```sh
python3 ~/.agents/skills/cmux-computer-use/scripts/cmux_computer_use.py status
```

### 3. Launch and front target app

Use `launch_app` with `bundle_id` (preferred) or `name`. Then call `bring_to_front` with the app `pid`.

```python
launch_res = client.call_tool("launch_app", {"bundle_id": "com.apple.calculator"})
pid = launch_res["structuredContent"]["pid"]
window_id = launch_res["structuredContent"]["windows"][0]["window_id"]

client.call_tool("bring_to_front", {"pid": pid})
```

### 4. Inspect window state

Call `get_window_state` to obtain the accessibility tree and optional screenshot.

```python
state = client.call_tool("get_window_state", {
    "pid": pid,
    "window_id": window_id,
    "include_screenshot": False
})
elements = state["structuredContent"]["elements"]
```

Filter elements carefully:

- Match `role == "AXButton"` when selecting buttons. Apps with application menus (such as Calculator) contain `AXMenuItem` entries with the same numeric labels as keypad buttons.
- Extract `element_token` (e.g. `s0001:13`). Tokens carry the snapshot ID and target window ID.

### 5. Dispatch actions

#### Batched actions (`perform_actions`)
For a sequence of stable actions against known controls (such as clicking calculator buttons `1`, `0`, `0`, `+`, `1`, `0`, `5`, `=`), use `perform_actions`. This executes up to 20 actions in order inside one call without extra round-trips:

```python
actions = [
    {"tool": "click", "arguments": {"pid": pid, "window_id": window_id, "element_token": tok_1}},
    {"tool": "click", "arguments": {"pid": pid, "window_id": window_id, "element_token": tok_0}},
    {"tool": "click", "arguments": {"pid": pid, "window_id": window_id, "element_token": tok_0}},
    {"tool": "click", "arguments": {"pid": pid, "window_id": window_id, "element_token": tok_add}},
    {"tool": "click", "arguments": {"pid": pid, "window_id": window_id, "element_token": tok_1}},
    {"tool": "click", "arguments": {"pid": pid, "window_id": window_id, "element_token": tok_0}},
    {"tool": "click", "arguments": {"pid": pid, "window_id": window_id, "element_token": tok_5}},
    {"tool": "click", "arguments": {"pid": pid, "window_id": window_id, "element_token": tok_equals}},
]

client.call_tool("perform_actions", {"actions": actions, "stop_on_error": True})
```

#### Single actions
For interactive or step-by-step driving, use:

- `click`: pass `pid`, `window_id`, and `element_token`.
- `type_text`: pass `pid` and `text` for text fields.
- `press_key`: pass `pid` and `key` for keyboard shortcuts.

### 6. Verify result

Never assume a click succeeded without verification. Take a fresh `get_window_state` call with `include_screenshot: True` and inspect the updated values in `AXStaticText` or other element fields:

```python
final_state = client.call_tool("get_window_state", {
    "pid": pid,
    "window_id": window_id,
    "include_screenshot": True,
    "screenshot_out_file": "/path/to/screenshot.png"
})

for el in final_state["structuredContent"]["elements"]:
    if el.get("role") == "AXStaticText":
        print(el.get("label"), "=", el.get("value"))
```

## Practical tips and gotchas

1. **Catalyst app latency**: Catalyst apps (like Calculator) can return an empty accessibility tree immediately after launch. Sleep 0.5 to 1 second before calling `get_window_state`.
2. **Snapshot token lifespan**: Element tokens (`s0001:...`) belong only to the snapshot that generated them. If an action alters window layout (for example, clicking `All Clear`), re-snapshot with `get_window_state` before using further element tokens.
3. **Menu bar collision**: Always check `role == "AXButton"`. Calculator's menu bar contains `AXMenuItem` entries labeled `"1"`, `"0"`, `"5"` under the Decimal Places menu that will mis-click if matched by label alone.
4. **Agent cursor**: cmux displays a branded cyan/blue gradient cursor overlay during automation. Using `perform_actions` glides this cursor cleanly between buttons.

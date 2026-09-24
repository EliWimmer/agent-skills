---
name: cmux-browser
description: Controls cmux's in-app browser through the cmux CLI. Use when an agent needs to open or navigate a cmux browser, inspect a page, interact with web controls, or verify a local web app in cmux.
---

# Control the cmux browser

Use the `cmux browser` CLI for browser work. The Unix socket exposes the same operations; use it when building a purpose-built integration that needs structured requests, not for ordinary agent commands.

## Workflow

1. **Check access.** Confirm `cmux` is on `PATH` and run `cmux ping`. The default socket access permits processes launched inside cmux. If access fails, run the agent from a cmux terminal or report the exact blocker. Do not change the socket access mode to work around it.
2. **Choose a browser.** Run `cmux browser identify` to find the focused browser and its surface ID. Reuse the relevant existing browser; otherwise open one with `cmux browser open https://example.com`. Use the returned or identified ID explicitly, such as `surface:2`, when multiple browser surfaces may be open.
3. **Wait for the page.** Navigate with `cmux browser surface:2 navigate https://example.com`. Replace `2` with the chosen surface ID. Wait for a meaningful condition, such as `--load-state complete`, a selector, text, or URL. Prefer `wait` over fixed delays.
4. **Inspect before acting.** Use `snapshot --interactive --compact` for the page, or scope it with `--selector` and `--max-depth`. Use `get` for a specific value and `find` to locate controls by role, label, text, or placeholder.
5. **Interact and verify.** Use `click`, `fill`, `type`, `press`, `select`, and related DOM commands. After each important action, wait for the expected change and verify it with `get`, `is`, or another snapshot. Add `--snapshot-after` to a mutating command when it helps.
6. **Finish on evidence.** Stop when the requested page state or action is visibly confirmed. If it fails, inspect the URL, snapshot, `errors list`, or `console list`, then report the observed result rather than guessing.

## Common sequence

```sh
cmux browser open http://localhost:3000
cmux browser identify
cmux browser surface:2 wait --load-state complete --timeout-ms 15000
cmux browser surface:2 snapshot --interactive --compact
cmux browser surface:2 click "button[type='submit']" --snapshot-after
cmux browser surface:2 wait --text "Saved"
```

Replace `2` with the surface reported by cmux and adapt the selector and expected text to the page. Use `screenshot --out /tmp/cmux-page.png` when visual layout matters or the DOM does not expose what needs inspection. Use `eval` only when DOM inspection and interaction do not cover the task.

For current subcommands, options, and examples, consult the [cmux browser automation docs](https://cmux.dev/docs/browser-automation).

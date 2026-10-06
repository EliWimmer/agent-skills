---
name: svelte-effects
description: >
  Instructions for using Svelte 5 `$effect` correctly and choosing better
  alternatives. Use when implementing or refactoring components that use `$effect`, `$effect.pre`,
  `$effect.root`, side effects, reactive syncing, infinite loops, or asks where
  to put setup/teardown, data fetching, or DOM logic in a Svelte 5 component.
paths:
  - "**/*.svelte"
  - "**/*.svelte.**"
---

# Using `$effect` and its alternatives

**Rule:** `$effect` is an **escape hatch**, not the default tool for reactivity.
Most code that reaches for `$effect` should use `$derived`, an event handler, an
attachment, or `onMount` instead. Reserve `$effect` for genuine side-effects that
synchronize Svelte state with something **outside** the reactive system.

## Decision guide — what to use instead

| You want to… | Use | Not `$effect` because |
| --- | --- | --- |
| Compute a value from other state | `$derived` / `$derived.by` | Effects that write state cause extra renders and loops |
| Keep two pieces of state "in sync" | `$derived` (one is derived) or update both in the handler | Two-way effect sync is the #1 source of infinite loops |
| Run code in response to a user action | Event handler (`onclick`, `oninput`, change callback) | Effects make data flow implicit and hard to trace |
| One-time setup on mount | `onMount(() => { … return cleanup })` | Effects re-run; mount runs once |
| DOM wiring / measure / 3rd-party widget | An **attachment** (`{@attach fn}`) | Attachments are scoped to the element and auto-clean up |
| Fetch when an input changes | Derive a request from state, or fetch in the handler | Effect fetching races and double-fires easily |

If none of the above fit and you must bridge to a non-reactive external system,
then use `$effect`.

## Legitimate uses of `$effect`

- Subscribing to a **non-reactive external source** (event emitter, WebSocket,
  `ResizeObserver`, media query) and tearing it down.
- **Imperative DOM** work that must react to state and isn't tied to one element
  (an attachment is preferred when it *is* tied to one element).
- Glue for **third-party libraries** that need to be told when state changes.
- **Lazily loading** data into a cache keyed off changing inputs (read the keys,
  call the loader; don't write derived state back).

```svelte
<script>
	let width = $state(0);

	function trackWidth(node) {
		const ro = new ResizeObserver(([e]) => (width = e.contentRect.width));
		ro.observe(node);
		return () => ro.disconnect();
	}
</script>

<!-- Prefer an attachment for element-scoped side effects -->
<div {@attach trackWidth}>…</div>
```

## Anti-patterns

```svelte
<!-- ❌ Syncing state with an effect -->
<script>
	let count = $state(0);
	let doubled = $state(0);
	$effect(() => { doubled = count * 2; }); // extra render; can loop
</script>
```

```svelte
<!-- ✅ Derive it -->
<script>
	let count = $state(0);
	const doubled = $derived(count * 2);
</script>
```

Other anti-patterns:

- Writing to state you also **read** inside the same effect → infinite loop.
- Using `$effect` to call a function "whenever X changes" that's really an event
  response → call it from the handler that changed X.
- Putting one-time setup in `$effect` instead of `onMount`.
- Reaching for `$effect` to avoid prop drilling or to share state → use a module
  class (see `svelte-module-classes`).

## The effect runes

- **`$effect(fn)`** — runs after the DOM updates; re-runs when any state **read
  during its last run** changes. Return a function for cleanup (runs before re-run
  and on destroy).
- **`$effect.pre(fn)`** — same, but runs **before** the DOM updates (rare; e.g.
  measuring scroll position before a change paints).
- **`$effect.root(fn)`** — creates an effect scope **outside** the component
  lifecycle; returns a cleanup you must call yourself. Use for effects owned by a
  module class or other long-lived object, and call cleanup in its `destroy()`.

```ts
// module class owning a non-component effect
export class Watcher {
	#stop: (() => void) | null = null;
	start() {
		this.#stop = $effect.root(() => {
			$effect(() => { /* react to external thing */ });
		});
	}
	destroy() { this.#stop?.(); }
}
```

## Gotchas

- **Dependencies are tracked by reads, not declared.** State read only inside an
  `async` continuation or after an `await` is **not** tracked. Read everything you
  depend on synchronously at the top of the effect.
- Effects **batch** and run after render; they are not synchronous with the state
  change that triggered them.
- `untrack(() => …)` reads state without registering it as a dependency — use to
  break a self-trigger loop deliberately.
- Effects don't run during SSR.

## Checklist

1. Computing a value? → `$derived`. Never write state from an effect to "sync" it.
2. Responding to user input? → event handler.
3. One-time setup? → `onMount`. Element-scoped DOM? → attachment.
4. Bridging to an external/non-reactive system? → `$effect` (with cleanup).
5. Effect outside a component? → `$effect.root`, cleaned up in `destroy()`.
6. Read every dependency synchronously, before any `await`.

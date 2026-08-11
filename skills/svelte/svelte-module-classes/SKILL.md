---
name: svelte-module-classes
description: >
  Instructions for creating Svelte 5 module classes — class-based reactive state in
  `.svelte.ts` modules using runes. Use when implementing or refactoring components that use module classes, `.svelte.ts`, runes-in-classes, `$state` fields, or state architecture. Or when the user mentions module classes.
paths:
  - "**/*.svelte"
  - "**/*.svelte.**"
---

# Svelte 5 module classes

**Pattern:** put reactive app/feature state in a plain class inside a `.svelte.ts`
module, using runes (`$state`, `$derived`) for fields. This replaces Svelte stores
and `getContext`/`setContext` for non-trivial state. Components stay thin and read
from the class via props or imports.

## When to use

| Need | Pattern |
| --- | --- |
| App-wide state (theme, session, registries) | A **singleton** module class |
| Scoped state (a tab, pane, form, wizard, list) | A class **instance created upstream and passed as a prop** |
| Purely local UI state (open/hover/draft) | Component-local `$state` — no class needed |
| One value shared by a few files | A small singleton, or exported runes (see below) |

Reach for a class when state outlives a single component, must be touched from
`.ts`/non-component code, or bundles state + behavior together.

## Anatomy

```ts
// thing-manager.svelte.ts
export class ThingManager {
	// Public reactive state — components read these directly
	items = $state<Thing[]>([]);
	selectedId = $state<string | null>(null);

	// Derived state — never recompute by writing into $state
	readonly selected = $derived(
		this.items.find((t) => t.id === this.selectedId) ?? null,
	);
	readonly count = $derived(this.items.length);

	// Non-reactive internals are #private
	#subscription: Subscription | null = null;
	#saveTimer: ReturnType<typeof setTimeout> | null = null;

	add(thing: Thing) {
		this.items = [...this.items, thing];
		this.#scheduleSave();
	}

	select(id: string) {
		this.selectedId = id;
	}

	#scheduleSave() {
		if (this.#saveTimer) clearTimeout(this.#saveTimer);
		this.#saveTimer = setTimeout(() => void this.#save(), 500);
	}

	async #save() { /* persist this.items */ }

	destroy() {
		this.#subscription?.unsubscribe();
		if (this.#saveTimer) clearTimeout(this.#saveTimer);
	}
}
```

Rules of thumb:

- **`$state` for mutable fields, `$derived` for computed** — class fields work with
  runes exactly like component-local state. Mark derived/read-only fields `readonly`.
- **Public reactive fields are fine.** Use `#private` for non-reactive internals
  (timers, subscriptions, caches, flags). Expose mutations through methods.
- **Reassign for reactivity.** `$state` arrays/objects are deeply reactive, but
  prefer clear mutations; `this.items = [...this.items, x]` is always safe.
- **`this` is bound by `$derived`/`$state` field initializers**, so derived fields
  may reference other fields directly. If you pass a method as a callback, bind it
  (arrow-field `handle = (e) => …` or `.bind(this)`).

## Exposing the class

Pick one of three shapes:

**1. Singleton via accessor** (lazy, testable, no import-time side effects):

```ts
let instance: ThingManager | null = null;
export function getThingManager(): ThingManager {
	return (instance ??= new ThingManager());
}
```

**2. Composed root object** — a central object instantiates managers; components
import that one object:

```ts
// app.svelte.ts
class App {
	things = new ThingManager();
	theme = new ThemeManager();
}
export const app = new App();
```

**3. Scoped instance passed as a prop** — for subtree state, create upstream and
pass down; do **not** use context to share it:

```svelte
<script lang="ts">
	const wizard = new WizardState();
</script>
<Step1 {wizard} />
<Step2 {wizard} />
```

Avoid module-top-level `export let x = $state(...)` of a primitive you intend to
reassign from other modules — exported bindings are read-only to importers. Wrap
primitives in a class/object (or export getter/setter functions) instead.

## State sync: avoid `$effect`

- **Never use `$effect` to sync state.** Computed values are `$derived`/`$derived.by`.
- Link values through **methods called from event handlers**, not reactive watchers.
- `$effect` (and `$effect.root` for non-component lifetimes) is an escape hatch for
  genuine external side-effects: subscribing to a non-reactive source, imperative
  DOM/measurement, third-party library glue. If you need an effect that lives
  outside a component, create it inside `$effect.root(() => …)` and call the
  returned cleanup in `destroy()`.

## Lifecycle and cleanup

- Classes have no automatic teardown. Give them an explicit `init()` / `destroy()`
  when they own subscriptions, timers, or listeners, and call `destroy()` from the
  owner (parent component `onMount` cleanup, or the composing root).
- Do setup in an `init()` method or constructor — but keep constructors cheap and
  avoid async work in them; expose `async ready()` / `await init()` instead.

## Persistence

- Route persistence through the class (often debounced), not from components.
- Keep serialization in the class (`toSnapshot()` / `fromSnapshot()`), so storage
  shape is owned in one place.

## Testing

- Module classes are plain classes — unit-test them directly. Reading `$state`/
  `$derived` fields in tests requires the Svelte runtime; for logic that must run
  without it, extract pure functions into a sibling `*.ts`/`*.logic.ts` and test
  those in isolation.

## File naming

- `name.svelte.ts` — the module class (runes require the `.svelte.ts` extension).
- `name.types.d.ts` or a shared types module — supporting types.
- `name.logic.ts` — pure, framework-free helpers (easiest to test).

## Checklist for a new module class

1. State outlives one component or is used from `.ts`? → module class.
2. App-wide → singleton/composed-root; subtree-scoped → instance passed as a prop.
3. Mutable fields `$state`, computed fields `$derived` (`readonly`), internals `#private`.
4. No `$effect` for state sync; mutate via methods from event handlers.
5. Owns subscriptions/timers? → add `init()`/`destroy()` and call `destroy()` from the owner.
6. Don't export a reassignable primitive `$state` across modules — wrap it.

---
name: svelte-context
description: >
  An explanation of the Svelte 5 `<svelte:boundary>` element and how to use it effectively. Use whenever the user mentions svelte boundary, <svelte:boundary>, or error handling in the template.
paths:
  - "**/*.svelte"
  - "**/*.svelte.**"
---

# Avoid `getContext` / `setContext`

**Rule:** Do not use Svelte’s context API for app or feature state. Prefer **module-level classes** (`.svelte.ts` with runes) and **explicit props** for scoped state.

### Use instead

| Need                                   | Pattern                                                                      |
| -------------------------------------- | ---------------------------------------------------------------------------- |
| App-wide state                         | One or a few module singletons (e.g. `core`, stores as classes)              |
| Scoped state (tab, pane, form, wizard) | A rune class instance, created by a parent and passed as props               |
| Leaf components                        | Props; call into module classes only when the logic belongs outside the tree |

### Why

- Context is bound to the component tree: hard to use from services/utilities, easy to break when providers unmount or refactor.
- Module classes give a stable, testable source of truth that does not depend on where a component sits in the tree.
- Explicit props make data flow obvious and grep-friendly.

### Allowed exceptions

- **Third-party libraries** that intentionally use context (overlay systems, design-system internals). Call their `provide*` / setup APIs at the root; do not mirror that pattern for your own app state.
- **Rare, truly local UI coupling** (e.g. button inside button-group styling) inside a library component — not for business logic, routing, selection, or persistence.

### Do not confuse with

- Domain terms like “user context” or method names like `getCommandContext()` — those are not Svelte context.
- Browser APIs like `canvas.getContext()`.

### Checklist for new code

1. Need state outside a single component? → module class or singleton, not `setContext`.
2. Need state in a subtree? → create an instance upstream, pass it down as a prop.
3. Need state in a `.ts` file? → module class; context will not fit cleanly.
4. Tempted to `setContext` to avoid prop drilling? → prefer a small scoped class passed once at the subtree root over invisible tree wiring.

---

If you want this saved as a Cursor rule or skill, say where (user rules, project `.cursor/rules/`, etc.) and I can drop it in that format.

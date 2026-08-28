---
name: svelte
description: Routes Svelte work to the relevant focused Svelte standards skills.
disable-model-invocation: true
---

# Svelte standards

Before changing Svelte code, identify every topic the work touches and use each
matching skill:

- **Attachments** — Use `/svelte-attachments` for element-scoped setup, reactive
  DOM behavior, cleanup, attachment factories, and migrations from actions.
- **Boundaries** — Use `/svelte-boundary` for pending UI, render/effect error
  handling, recovery with `reset`, error reporting, and server error transforms.
- **Context** — Use `/svelte-context` when state sharing suggests `getContext` or
  `setContext`; app and feature state should normally live in module classes,
  scoped instances passed as props, or explicit props.
- **Declaration tags** — Use `/svelte-declaration-tags` for template-local
  `{const ...}` and `{let ...}` bindings, including reactive `$derived`/`$state`
  values and migration from legacy `{@const ...}`.
- **Effects** — Use `/svelte-effects` before adding or refactoring `$effect`;
  prefer derived state, event handlers, `onMount`, or attachments unless the code
  genuinely bridges to an external non-reactive system.
- **Module classes** — Use `/svelte-module-classes` for shared or long-lived
  reactive state in `.svelte.ts` classes, including ownership, lifecycle,
  persistence, and testing.
- **Snippets** — Use `/svelte-snippets` for reusable or nested component content,
  snippet props, `children`, lexical scope, and migration from slots.
- **Tailwind CSS v4** — Use `/svelte-tailwind-4` when styling Svelte components;
  follow its class-array composition, BEM hook, state-attribute, typed-map,
  design-token, consumer-class, and utility-order standards.

Apply every selected skill's standards to the work; this router is only the map.

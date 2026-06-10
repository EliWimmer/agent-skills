---
name: svelte-tailwind-4
description: >
  Guides styling Svelte 5 components with Tailwind CSS v4 utilities, phoundry-ui
  color tokens, and script-level class composition. Use when implementing or
  refactoring component styles with Tailwind 4, phoundry-ui, utility classes,
  or when the user mentions Tailwind in Svelte.
---

# Tailwind 4 in Svelte components

Apply these rules whenever styling a `.svelte` file in a Tailwind 4 project.

## Class tokens

- Use Tailwind 4 class tokens for styling.
- Always use phoundry-ui color tokens if available (prefer design-system colors over raw palette utilities like `bg-zinc-500`).
- Always use available shorthands — e.g. `shrink-0` not `flex-shrink-0`, `grow` not `flex-grow`.
- Only use arbitrary values `-[<custom_value>]` when actually needed; prefer theme tokens and standard utilities first.
- Never use the `!` important directive. Important indicates poor architecture — fix specificity or structure instead.

## Where styles live

### Conditional classes → `$derived` at end of `<script>`

Conditional styles belong at the end of the `<script>` section using the `$derived` rune.

```svelte
<script lang="ts">
  let { size = 'medium' }: { size?: 'small' | 'medium' | 'large' } = $props();

  let elementSizeClass = $derived(
    size === 'large' ? 'p-4 text-lg' : 'p-2 text-md'
  );
</script>

<div class={elementSizeClass}>...</div>
```

Combine with static base classes in the template: `class="flex items-center {elementSizeClass}"`.

### Reused static classes → `const` at end of `<script>`

Reused but static styles belong at the end of the `<script>` tag as a `const`.

```svelte
<script lang="ts">
  const cardSurfaceClass =
    'rounded-lg border border-border bg-surface p-4 shadow-sm';
</script>

<div class={cardSurfaceClass}>...</div>
```

### `<style>` — last resort only

Only use the `<style>` tag for genuinely bespoke implementations not achievable with Tailwind classes alone — e.g. custom animations, complex keyframes, or selectors Tailwind cannot express.

Do not use `<style>` for colors, spacing, layout, or typography that utilities can cover.

## Workflow

1. Check phoundry-ui (or project theme) for color and surface tokens before picking raw Tailwind palette classes.
2. Put shared static utility strings in `const` at the bottom of `<script>`.
3. Put prop- or state-driven class logic in `$derived` at the bottom of `<script>`.
4. Apply classes on elements via `class` (and `class:` only when a single boolean toggle is clearer than `$derived`).
5. Add `<style>` only when utilities and `@theme` cannot express the effect.

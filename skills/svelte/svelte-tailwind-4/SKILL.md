---
name: svelte-tailwind-4
description: >
  Instructions for styling Svelte 5 components with Tailwind CSS v4 utilities, phoundry-ui
  color tokens, and composable class arrays. Use when implementing or refactoring components that use Tailwind 4, phoundry-ui, utility classes, class props, variants, or state-driven styling in Svelte. Or when the user mentions tailwind 4. 
paths:
  - "**/*.svelte"
  - "**/*.svelte.**"
---

# Tailwind 4 in Svelte components

Apply these rules whenever styling or refactoring a `.svelte` file in a Tailwind 4 project. Normalize class composition throughout each component you actively style; do not sweep unrelated components unless the user requests a migration.

## Class composition

- Use Svelte's class-array form on every styled element and component: `class={[...]}`.
- Never use the `class:` directive. Express conditions in the array or through native, ARIA, and data-attribute variants.
- Keep a short class list compact, typically `[BEM hook, styles]`.
- For long lists, group related utilities into composition units. Do not put every utility in its own array item.
- Keep single-use class arrays inline regardless of length. Extract only for reuse, except for reusable multi-input helpers or item-scoped helpers inside `{#each}` blocks.
- Add comments only when the reason for a class or condition is non-obvious; composition groups do not require labels.

```svelte
<div class={['empty-state__message', 'text-sm text-txt-secondary']}>...</div>

<div
  class={[
    'card__content',
    'relative flex min-h-0 flex-col',
    'rounded-lg border border-border bg-surface p-4 shadow-sm',
    'text-sm leading-normal text-txt-primary',
    'cursor-default select-none transition-colors',
    selected && 'ring-2 ring-accent-primary'
  ]}
>
  ...
</div>
```

Use this composition order, omitting groups that do not apply:

1. **Semantic hooks** — stable BEM block or element; then the primary appearance-variant modifier when applicable
2. **Root styles** — utilities that never change with props or state
3. **Conditional styles** — boolean or two-way prop/state conditions
4. **Mapped styles** — typed lookup results for axes with three or more values
5. **Compound styles** — an escape hatch for relationships that native, ARIA, data-attribute, and mapped variants cannot express cleanly
6. **Consumer classes** — always last and unspread

## BEM hooks

- Add one stable, descriptive BEM block or element hook first on every element or component receiving classes.
- Use BEM hooks only for structure, testing, integration, and readability. Never style through BEM selectors.
- Name conceptual roles, not DOM instances. Repeated equivalent elements share a hook such as `menu__divider`; never invent ordinal names such as `menu__divider-1`.
- Do not add state modifiers such as `button--active`; represent state with native, ARIA, or data attributes.
- As the one modifier exception, add the component's finite, primary appearance variant immediately after its stable root hook, for example `` `phi-button--${variant}` ``.
- Do not generate BEM modifiers for size, orientation, loading, active, disabled, or other configuration/state axes.

```svelte
<button class={['phi-button', `phi-button--${variant}`, 'inline-flex items-center rounded-lg']}>
  <span class={['phi-button__label', 'truncate']}>Save</span>
</button>
```

Only interpolate a BEM modifier from a finite, typed variant. BEM modifiers are semantic hooks, not Tailwind utilities.

## State styling

Represent binary state on the DOM whenever possible, then style it with Tailwind variants:

1. Use a native semantic attribute such as `disabled` or `checked` when available.
2. Otherwise use an applicable ARIA attribute such as `aria-pressed` or `aria-busy`.
3. Otherwise use `data-state` for a primary mutually exclusive state machine such as `open|closed`.
4. Use named boolean data attributes such as `data-loading` or `data-active` for orthogonal states that can coexist.

Never add an ARIA attribute solely as a styling hook or give it semantics the component does not have. Use JavaScript conditions or compound styles only when attribute variants cannot express the relationship cleanly.

```svelte
<button
  aria-pressed={active}
  data-loading={loading || undefined}
  class={[
    'toggle-button',
    'inline-flex items-center aria-pressed:ring-2',
    'data-loading:cursor-wait data-loading:opacity-70'
  ]}
>
  ...
</button>
```

## Typed maps and helpers

Use `condition && 'classes'` for boolean additions and a ternary when both sides of a two-way condition contribute classes. Do not use Svelte's class-object form with Tailwind strings as object keys.

For every finite style axis with three or more values, use an exhaustive typed lookup object. Use `satisfies Record<Variant, ClassValue>` so new variants must be considered while values retain narrow inference. Use `Partial<Record<Variant, ClassValue>>` only when omission deliberately means no supplemental classes.

```svelte
<script lang="ts">
  import type { ClassValue } from 'svelte/elements';

  type Variant = 'primary' | 'secondary' | 'danger';

  const variantClasses = {
    primary: 'border-white/15 bg-accent-primary text-txt-on-accent hover:bg-accent-primary-hover',
    secondary: [
      'border-transparent bg-surface-raised text-txt-primary',
      'aria-pressed:bg-accent-primary/15 aria-pressed:text-accent-primary'
    ],
    danger: 'border-transparent bg-semantic-error/10 text-semantic-error hover:bg-semantic-error/20'
  } satisfies Record<Variant, ClassValue>;
</script>
```

Prefer lookup objects for a single finite axis. Allow a helper returning `ClassValue` when its logic is reused across components, depends on multiple inputs, or must run with `{#each}` item scope. Do not create a local helper merely to hide one single-use expression.

All Tailwind utilities in arrays, maps, and helpers must appear as complete literal tokens so Tailwind can detect them. Never construct utilities dynamically, such as `` `bg-${color}-500` ``; map inputs to complete class strings instead.

## Reuse

Keep a class array inline unless the complete class value is reused. Extract a reused static value to `const`; use `$derived` when a reused value depends on reactive props or state.

An exactly repeated utility subset also counts as reuse when elements have genuinely different conceptual roles. Compose the shared value as a nested array item rather than spreading it:

```svelte
<script lang="ts">
  const sharedItemStyles = [
    'flex items-center gap-2',
    'rounded-md px-2 py-1 text-sm hover:bg-surface-overlay-hover'
  ];
</script>

<button class={['menu__primary-item', sharedItemStyles]}>...</button>
<button class={['menu__secondary-item', sharedItemStyles]}>...</button>
```

If the same styling is reused across many components, prefer a shared component or Tailwind `@utility` over copying constants between files.

## Consumer classes

Type custom component `class` props as `ClassValue`, unless inherited Svelte element attributes already provide that type. Destructure the prop as `class: className` and place it unspread as the final array item so strings, arrays, objects, and nested combinations all compose correctly.

```svelte
<script lang="ts">
  import type { ClassValue } from 'svelte/elements';

  interface Props {
    class?: ClassValue;
  }

  let { class: className }: Props = $props();
</script>

<div class={['panel', 'flex min-h-0 flex-col', className]}>...</div>
```

Consumer classes are an additive extension boundary, not a guaranteed override API. Tailwind resolves conflicting utilities by generated stylesheet order, not by token order in the class attribute. Expose a component prop or variant when a reliable project-owned customization is required.

Do not use Tailwind's important modifier inside project-owned components; fix their API, variants, or specificity. When consuming a component owned by another source or package—even if locally linked—an important modifier is acceptable for an intentional application-specific override when no suitable component API exists. Use Tailwind 4 suffix syntax such as `bg-surface!`, not deprecated prefix syntax such as `!bg-surface`.

## Utility order

Generally order utilities within each string by:

1. Structure
2. Shape and spacing
3. Typography
4. Interaction
5. Conditional variants

Conditional variants include responsive, environment, hover/focus/disabled, ARIA/data, group, and peer prefixes. In a long conditional section, keep related prefixes together and apply the same structure-to-interaction order within each prefix.

If the project uses an established Tailwind-aware formatter, its output takes precedence. Never churn formatter-produced ordering merely to match this manual guidance.

## Class tokens

- Use Tailwind 4 class tokens for styling.
- Always use phoundry-ui color tokens if available; prefer design-system colors over raw palette utilities such as `bg-zinc-500`.
- Always use available shorthands: `shrink-0` not `flex-shrink-0`, `grow` not `flex-grow`.
- Use arbitrary values only when needed; prefer theme tokens and standard utilities first.

## `<style>` as a last resort

Use `<style>` only for genuinely bespoke implementations that Tailwind cannot express cleanly, such as complex keyframes, third-party internals, injected markup, or selectors outside the component's control.

Do not use `<style>` for colors, spacing, layout, or typography that utilities can cover.

## Workflow

1. Check phoundry-ui or the project theme for tokens before choosing raw Tailwind palette classes.
2. Normalize every class attribute in the component being styled to the canonical array form; remove all `class:` directives in that component.
3. Add stable, role-based BEM hooks and only the permitted primary appearance-variant modifier.
4. Prefer native, ARIA, and data attributes for state styling.
5. Keep single-use arrays inline; extract only reused values and allowed helpers.
6. Use exhaustive typed maps for finite multi-value style axes and complete literal Tailwind tokens everywhere.
7. Put consumer `ClassValue` last without promising conflict overrides.
8. Add `<style>` only when utilities, variants, attributes, and `@utility` cannot express the effect.

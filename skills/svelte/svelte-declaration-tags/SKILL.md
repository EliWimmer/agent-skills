---
name: svelte-declaration-tags
description: >
  Instructions for using Svelte 5.56+ declaration tags `{let ...}` and `{const ...}` to declare local variables inside markup. Use when implementing or refactoring components that use `{const ...}`, `{let ...}`, declaration tags, or legacy `{@const ...}` template syntax. Or when the user mentions declaration tags, inline variables in markup, or replacing `{@const}`.
paths:
  - "**/*.svelte"
  - "**/*.svelte.**"
---

```svelte
<!--- copy: false  --->
{const name = expression}
```

```svelte
<!--- copy: false  --->
{let name = expression}
```

Declaration tags define local variables inside markup with `const` or `let`. They
replace the legacy `{@const ...}` template syntax, which is now considered legacy
and should not be used in new code.

> [!NOTE]
> Declaration tags are available since Svelte 5.56. The `{@const ...}` syntax is
> considered legacy — use declaration tags instead.

## When to use

Use declaration tags to give a name to a computed value inside markup so it can be
read multiple times without re-computing, or to make a complex expression readable.

```svelte
{#each boxes as box}
	{const area = box.width * box.height}
	{const label = `${box.width} ⨉ ${box.height} = ${area}`}

	<p>{label}</p>
{/each}
```

Prefer declaration tags over repeating a long expression, over computing something
in `<script>` that only the template needs, and over introducing throwaway `$derived`
fields for values that are only meaningful in a narrow template scope.

## `let` vs `const`

- `{const name = expr}` — the binding cannot be reassigned. Use by default.
- `{let name = expr}` — the binding can be reassigned from event handlers in the
  same scope. Use only when you need to mutate the local binding from markup.

```svelte
{#if editing}
	{let name = user.name}
	{const greeting = $derived(`Hello ${name}`)}

	<input bind:value={name} />
	<p>{greeting}</p>

	<button onclick={() => { user.name = name; editing = false; }}>save</button>
{/if}
```

## Reactivity: `$state` and `$derived` inside markup

Declaration tags can host runes. Use `$state` for mutable reactive local values and
`$derived` for computed reactive values that should track other state:

```svelte
{#if editing}
	{let name = $state(user.name)}
	{const greeting = $derived(`Hello ${name}`)}

	<input bind:value={name} />
	<p>{greeting}</p>
{/if}
```

A plain `{const x = obj.field}` is **not** reactive — it captures the value once per
scope evaluation. If you need the binding to track changes to other state, use
`$derived`. If you need it to be mutable and reactive, use `$state`.

## Scope

Declaration tags can be used anywhere inside the component. They can reference
values declared outside themselves (for example in the `<script>` tag or in
`{#each ...}` blocks) and are 'visible' to everything in the same lexical scope
(i.e. siblings, and children of those siblings):

```svelte
{const hello = 'hello'}
{hello} <!-- 'hello' -->
<div>
	{const hello = 'hi'}
	{hello} <!-- 'hi' -->
	<div>
		{hello} <!-- 'hi' -->
	</div>
</div>
{hello} <!-- 'hello' -->
```

Like other block-scoped bindings, a declaration tag is **not** visible to siblings
of an ancestor or to ancestors themselves — only to following siblings and their
descendants. Shadowing an outer binding in a nested scope is allowed but can hurt
readability; prefer a distinct name.

## Migrating from `{@const ...}`

`{@const name = expr}` and `{const name = expr}` behave the same way. To migrate:

1. Replace `{@const` with `{const`.
2. Leave the rest of the tag unchanged.

There is no behavioral difference; the new syntax is purely an authoring change.
Prefer declaration tags in all new code and when editing nearby lines in old code.
Do not churn unrelated files solely to migrate.

## Gotchas

- A plain `{const x = someState}` captures the value at evaluation time and is
  **not** reactive — use `$derived` when the binding must track state changes.
- Declaration tags are **block scoped**. A tag declared inside an `{#if}`/`{#each}`
  /`{#snippet}` block is not visible outside that block.
- A declaration tag is only visible to **following** siblings and their descendants,
  not to preceding siblings. Declare it before the markup that uses it.
- Do not use declaration tags for values that belong in `<script>` (used by
  multiple handlers, exported, or referenced by snippets outside the scope).
- Avoid shadowing outer bindings with the same name in nested scopes; it harms
  grep-ability and readability.

## Checklist

1. Need a named value only the template uses? → declaration tag.
2. Value must track other state? → `$derived` inside the tag, not a plain `const`.
3. Value must be mutable from markup handlers? → `{let ...}` with `$state`.
4. Migrating legacy code? → replace `{@const` with `{const`; do not churn unrelated files.
5. Declare before use; remember the binding is block-scoped and forward-only.

### Types

- Always use ambient type declarations for global types in adjacent files. (See File Naming and Structure)

### Svelte Conventions
  - Avoid `$effect`. Use `onMount()`, `$state`, `$derived` / `$derived.by` instead. Prefer event-driven over reactive programming. See skill `svelte-effects`.
  - Avoid `bind:this` and `use:action`. Use Svelte 5 attachments: `{@attach fn}` where `fn = (element) => cleanup`. See skill `svelte-attachments`.
  - Avoid `getContext`/`setContext`. Use Svelte module classes (`.svelte.ts`) for global/shared state. See skill `svelte-module-classes`.
  - Avoid `{#key}` blocks unless essential.
  - Use `{@render...}` with `{#snippets...}` instead of `<slot \>`. See skill `svelte-snippets`.
### File Naming and Stucture

- Component/module may use these files:
  - `<name>.svelte` - Component itself.
  - `<name>.svelte.ts` - Component/module script.
  - `<name>.types.d.ts` - Ambient type declarations.
  - `<name>.data.ts` - Constants and data structures.
  - `<name>.snippets.svelte` - Exported snippets for context menu/modal dialogs.
- Files with multiple adjacent files → group in directory.

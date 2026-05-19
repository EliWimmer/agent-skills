# Context Glossary Format

Context glossaries live under `docs/context/`. Use this format for every context file — top-level `CONTEXT.md` and sub-context `<slug>.md` files alike.

## Layout

```
docs/context/
├── CONTEXT.md              ← cross-cutting terms only
├── CONTEXT-MAP.md            ← index (create when a second context emerges)
├── <bounded-context>/
│   └── <slug>.md
└── ...
```

- **Subdirectories** — kebab-case bounded-context names (semantic, not `src/` paths)
- **Slug files** — kebab-case; one cohesive glossary cluster per file
- New subdirectory when the bounded context is genuinely separate; new slug file when an existing context fits but the glossary is large or covers a distinct sub-area

## Glossary structure

```md
# {Context Name}

{One or two sentence description of what this context is and why it exists.}

## Language

**Order**:
{A concise description of the term}
_Avoid_: Purchase, transaction

**Invoice**:
A request for payment sent to a customer after delivery.
_Avoid_: Bill, payment request

**Customer**:
A person or organization that places orders.
_Avoid_: Client, buyer, account

## Relationships

- An **Order** produces one or more **Invoices**
- An **Invoice** belongs to exactly one **Customer**

## Example dialogue

> **Dev:** "When a **Customer** places an **Order**, do we create the **Invoice** immediately?"
> **Domain expert:** "No — an **Invoice** is only generated once a **Fulfillment** is confirmed."

## Flagged ambiguities

- "account" was used to mean both **Customer** and **User** — resolved: these are distinct concepts.

## Related

- [Fulfillment](./fulfillment/shipping.md) — when invoices are generated
- [ADR-0042: Event-sourced orders](../../adr/0042-event-sourced-orders.md)
```

Include `## Related` only when links exist (3–6 items max). Skip links already obvious from `CONTEXT-MAP.md`.

## Rules

- **Be opinionated.** When multiple words exist for the same concept, pick the best one and list the others as aliases to avoid.
- **Flag conflicts explicitly.** If a term is used ambiguously, call it out in "Flagged ambiguities" with a clear resolution.
- **Keep definitions tight.** One sentence max. Define what it IS, not what it does.
- **Show relationships.** Use bold term names and express cardinality where obvious.
- **Only include terms specific to this project's context.** General programming concepts don't belong.
- **Group terms under subheadings** when natural clusters emerge.
- **Write an example dialogue** that shows how terms interact and clarifies boundaries.

## Top-level vs sub-context

**`docs/context/CONTEXT.md`:** cross-cutting terms only. When mentioning a term owned elsewhere, link out — do not duplicate the definition.

**Sub-context files:** terms owned by one bounded context. Link to siblings and ADRs in `## Related` when the relationship is non-obvious.

## CONTEXT-MAP.md

Create when a second bounded context emerges (or during mid-grill split). Lives at `docs/context/CONTEXT-MAP.md`:

```md
# Context Map

## Contexts

- [Ordering](./ordering/fulfillment.md) — receives and tracks customer orders
- [Billing](./billing/invoicing.md) — generates invoices and processes payments
- [Fulfillment](./fulfillment/shipping.md) — warehouse picking and shipping

## Relationships

- **Ordering → Fulfillment**: Ordering emits `OrderPlaced` events; Fulfillment consumes them to start picking
- **Fulfillment → Billing**: Fulfillment emits `ShipmentDispatched` events; Billing consumes them to generate invoices
- **Ordering ↔ Billing**: Shared types for `CustomerId` and `Money`
```

## Cross-linking

- **Context → context:** relative path within `docs/context/`; link to the most specific slug file
- **Context → ADR:** relative path to `docs/adr/NNNN-slug.md` when a term depends on a recorded decision
- **ADR → context:** optional one-line "See also" in the ADR body when the decision introduces domain terms
- **Top-level CONTEXT.md → sub-context:** link when mentioning a term without owning its definition

## Discovery

- If `CONTEXT-MAP.md` exists → read it to find contexts
- If only `docs/context/CONTEXT.md` exists → single-context repo (for now)
- If neither exists → create `docs/context/CONTEXT.md` lazily when the first term is resolved
- Infer which sub-context the current topic relates to; if unclear, ask

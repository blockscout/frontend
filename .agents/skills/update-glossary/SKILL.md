---
name: update-glossary
description: Add a new term, update an existing definition, or remove an outdated entry in `.agents/GLOSSARY.md`. Use whenever the user wants to write something into the project glossary, or asks "should this be in the glossary?". Enforces the file's principle — disambiguation and etymology only, no paths/env vars/UI-location restatements.
---

# Update the project glossary

`.agents/GLOSSARY.md` is the **ubiquitous-language** reference for the Blockscout
frontend. It exists to disambiguate easily-confused terms and explain
non-obvious names. It is **not** a feature index, a config reference, or a
folder map — those live in code, `docs/ENVS.md`, and `.agents/rules/`.

This skill ensures any glossary edit follows the same principles the file was
designed around.

## When to use this skill

- The user asks to "add", "update", or "define" a term in the glossary.
- The user asks whether a term *should* be in the glossary.
- During other work, you notice a term that meets the inclusion criteria
  below and the user agrees to add it.

## Inclusion criteria — does the term belong?

A term earns a row **only if at least one is true**:

1. It has a non-obvious meaning a reader will likely misread (acronyms,
   codenames, chain-specific words like `Epoch`, `Kettle`, `Operation`).
2. It is easily confused with another term in this codebase (e.g.
   `Block Reward` vs `Rewards`, `Connect Wallet` vs `Web3 Wallet`,
   `CCTX` vs `Interchain Indexer`).
3. It has etymology worth recording (acronym expansion, original product
   name, why it was renamed).
4. It establishes scope a reader can't recover by grepping (e.g. `Account`
   covers watchlist + private tags + custom ABI + API keys + …).

**Reject** if the term is self-explanatory from its name alone (`CSV Export`,
`API Docs`, `Verified Tokens`, `Multichain Button`). Folder existence is
not a reason to add a row.

## What a row must NOT contain

Do not write any of these — they drift, they bloat the file, and they're all
recoverable from code or other docs:

- **Folder paths** (`src/features/<name>/`, `client/...`, etc.). Path follows
  predictably from the term's kebab-case feature name.
- **Env var names** (`NEXT_PUBLIC_X_ENABLED`). These live in `docs/ENVS.md`.
- **UI-location restatements** ("Displayed in the rollup navigation",
  "Exposed as a section under Tokens", "Surfaces as a button in the top bar").
  Trivially recoverable from the rendered app or a grep.
- **Implementation details** ("Has two provider backends", "Notifies via a
  hook", "Has its own context provider").
- **Status qualifiers like `(config-gated)` or `(chain-specific)`.** The Kind
  column already implies this (every `feature` row is config-gated).
- **First-class-entity restatements** ("Has its own detail page"). The Kind
  column says it.

## Table structure

The file is a single alphabetical table with three columns:

| Column | Content |
|---|---|
| **Term** | Bold term name. Codename in parens when it differs from the product name: `**TAC (Ton Application Chain)**`, `**User Op (User Operation)**`. |
| **Kind** | One of `entity` / `feature` / `service` / `chain` / `concept`. See the Kinds list at the top of the file. |
| **Definition** | One or two short sentences. Disambiguation, etymology, scope. May end with a cross-reference. |

### Picking the Kind

- **entity** — a blockchain object that surfaces as a first-class UI element
  (detail page, list row, API resource). E.g. `Blob`, `Block Reward`, `Kettle`.
- **feature** — a config-gated product area. Most rows are this. E.g.
  `Marketplace`, `Connect Wallet`, `Advanced Filter`.
- **service** — an external system (Blockscout-operated or third-party) that
  backs a feature. E.g. `BENS`, `Clusters`, `SolidityScan`, `MetaSuites`.
- **chain** — a specific chain or chain concept. E.g. `Beacon Chain`,
  `SUAVE`, `TAC`.
- **concept** — an architectural / structural term. E.g. `Rollup`,
  `Chain Variant`.

If the term could fit two kinds, pick the one that best matches how a reader
will first encounter it.

### Cross-reference phrasings (use these verbatim)

- `Distinct from **X**.` — strong disambiguation between commonly-confused
  terms.
- `Contrast with **X**.` — paired-opposite concepts (`Rollup` ↔ `Chain Variant`).
- `Co-located with **X**.` — terms that share a UI surface (`BENS` ↔ `Clusters`).
- `A sub-feature of **X**.` — hierarchical relation.
- `See also: **X**, **Y**.` — related but not strictly confusable.

The referenced term must already be in the table (or be added in the same
edit).

## Workflow

### 1. Confirm the term and its meaning

Search the codebase to confirm what the term actually refers to. Read the
relevant folder's `config.ts`, the page components, or the types file. Do
not guess from the name alone — codename / product-name mismatches happen
(e.g. `connectWallet` config key for the "Connect Wallet" feature, formerly
`blockchain-interaction`).

Reuse the existing exploration tools:

- `ls src/features/` to confirm folder names.
- `grep -r "<term>"` to find usages.
- Read the feature's `config.ts` for the canonical title and any
  rename history.

### 2. Check if it's already in the glossary

`grep -i "<term>" .agents/GLOSSARY.md`. If a row already exists under a
different label (e.g. the user says "Merits" but the row is `Rewards`),
update that row rather than creating a duplicate.

### 3. Identify cross-references

Before drafting, scan the glossary for terms that:

- The new term could be confused with.
- The new term depends on or relates to.
- Currently reference *this* term and may need their wording updated.

Plan the cross-references in both directions — if you add `X` with
"Distinct from **Y**", check that **Y**'s row mentions **X** when it should.

### 4. Draft the row

Write a one- or two-sentence definition that:

- States what the term *is* (not where it lives or how it's wired).
- Includes any etymology or codename in parens after the bold term.
- Ends with a cross-reference clause when there's a confusable neighbor.

Apply every "MUST NOT contain" rule from above. If a sentence ends up just
describing where something appears in the UI or how the code is structured,
delete it.

### 5. Place it alphabetically

The table is sorted by the term as it appears in bold (the codename in
parens does not count for ordering — `TAC (Ton Application Chain)` sorts
under T). Insert in the right place; do not append at the bottom.

### 6. Update cross-referencing rows

If you added a "Distinct from **Y**" clause, ensure **Y**'s row reciprocates
when warranted. Add or refine the cross-ref there.

### 7. Verify

- `grep -nE "src/|NEXT_PUBLIC_|\.ts\b" .agents/GLOSSARY.md` — should be empty
  apart from the intro paragraph and intentional package names like
  `@blockscout/points-types`.
- Visual scan: the new row's sentence shape matches its neighbors; the Kind
  column has one of the five valid values; cross-refs use **bold** and the
  approved phrasings.

## Examples

### Good

```
| **Operation** | entity | **TAC**-specific entity representing a bridge operation between the TON and EVM ecosystems. No equivalent on standard EVM chains. |
```

Why it works: explains what the term is, where the name comes from
(TAC-specific), and the scope (no equivalent elsewhere). No folder path, no
env var, no UI location.

```
| **Rewards** | feature | The Blockscout Merits program — a token rewards and incentives system operated by Blockscout. Entirely distinct from **Block Reward** (on-chain block-producer payouts). |
```

Why it works: includes the codename ("Merits"), establishes who operates it,
and disambiguates from the easily-confused `Block Reward`.

### Bad (and how to fix)

```
| **Marketplace** | feature | Curated directory of dApps. Lives at `src/features/marketplace/`. Config-gated via `NEXT_PUBLIC_MARKETPLACE_ENABLED`. Surfaces a full-page UI with categories and app detail views. *(config-gated)* |
```

Problems: folder path, env var name, UI-shape restatement, and a
status qualifier that duplicates the Kind. Fix:

```
| **Marketplace** | feature | Curated directory of dApps and DeFi applications integrated with Blockscout. |
```

## When the user asks "should X be in the glossary?"

Apply the inclusion criteria honestly. The answer is often "no" — most
feature folders do not need a glossary entry. If the term is self-explanatory
or there's no neighbor it can be confused with, recommend leaving it out.
A short glossary that means something beats a long one that mirrors the
folder listing.

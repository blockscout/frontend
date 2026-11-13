# 07 — Social preview

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 07 of #3856 |
| Blocked by | T02 |

## What to build

A shared receipt link produces a social preview. Its title names it a transaction receipt; its description
is the one the transaction page uses, enhanced variant included. The receipt route reuses the transaction
page's data fetching for social-preview bots — same conditions, same resources, same time budget — by
sharing that code with `/tx/[hash]`, not copying it.

Covers FR18.

## Acceptance criteria

- [ ] The receipt's metadata entry has an `og` title naming a transaction receipt and the `/tx/[hash]` `og` description templates
- [ ] The bot data fetching is one shared function used by both `/tx/[hash]` and `/tx/[hash]/receipt`; the transaction page's behaviour is unchanged
- [ ] Unit tests cover the receipt's generated metadata with and without the preview data

## Details

- `og` title: `%chain_name% transaction receipt %hash_short%`, mirroring the transaction page's.
- The multichain transaction page fetches no preview data today; the multichain receipt follows it.

## Leaf worklist

- [x] 1 `[agent]` Share the transaction preview fetching between the two routes
- [x] 2 `[agent]` Receipt `og` metadata, with unit tests

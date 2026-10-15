# Lists — context

Helpers shared by the data lists (tables and their mobile counterparts) that are not about paging; paging
lives in `src/shared/pagination/`.

## What an editor of a list component must keep true

- **Row keys come from `useUniqueKeys`, never from a hand-built string.** Any key assembled from item
  fields is a guess at uniqueness, and the API has disproved every such guess so far (ERC-1155 batches,
  nullable hashes, per-chain duplicates). A duplicated key is not cosmetic: React never unmounts the
  shadowed row, so it stays on screen through every subsequent page (issue #3628).
- **Compute the keys over the full list, then slice.** `useLazyRenderedList` renders a growing window of
  the list; keys taken from the sliced array shift as the window grows.
- **A base key must not include the loading state or the array index.** Placeholder rows share a base
  key and the ordinal already tells them apart; an index suffix re-introduces the instability under socket
  prepends that the ordinal exists to avoid.

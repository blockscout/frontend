// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

// React tracks pending removals in a key -> fiber map, so rows that share a key are never
// unmounted and stay in the DOM through every subsequent page. No per-entity key is immune:
// an ERC-1155 batch may legally transfer the same token id twice in one log.
// https://github.com/blockscout/frontend/issues/3631
//
// Collisions get an ordinal by position within their group, not within the list, so prepending
// items (socket updates) leaves the keys of the existing rows unchanged.
export function getUniqueKeys<T>(items: ReadonlyArray<T> | undefined, getBaseKey: (item: T) => string): Array<string> {
  if (!items) {
    return [];
  }

  const occurrences = new Map<string, number>();

  return items.map((item) => {
    const baseKey = getBaseKey(item);
    const occurrence = occurrences.get(baseKey) ?? 0;
    occurrences.set(baseKey, occurrence + 1);

    return occurrence === 0 ? baseKey : `${ baseKey }_${ occurrence }`;
  });
}

export function useUniqueKeys<T>(items: ReadonlyArray<T> | undefined, getBaseKey: (item: T) => string): Array<string> {
  return React.useMemo(() => getUniqueKeys(items, getBaseKey), [ items, getBaseKey ]);
}

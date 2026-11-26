// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

// A repeated base key gets an ordinal by its position among the repeats, not within the list, so prepending
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

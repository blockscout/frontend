// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

function isShallowEqual(a: object, b: object): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) {
    return false;
  }
  return keysA.every((key) => Object.is(a[key as keyof typeof a], b[key as keyof typeof b]));
}

// Keeps the previous object while every own property is identical, so consumers memoized on the
// object (React.memo, useMemo deps) are not invalidated by a re-render that changed nothing.
export function useShallowStable<T extends object>(value: T): T {
  const stableRef = React.useRef(value);
  if (!isShallowEqual(stableRef.current, value)) {
    stableRef.current = value;
  }
  return stableRef.current;
}

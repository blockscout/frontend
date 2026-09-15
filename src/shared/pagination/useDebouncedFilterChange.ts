// SPDX-License-Identifier: LicenseRef-Blockscout

import { debounce } from 'es-toolkit';
import React from 'react';

import { SECOND } from 'src/toolkit/utils/consts';

export const DELAY = 0.3 * SECOND;

export type FilterChangeHandler = (value: string) => void;

// The latest handler is read when the debounce fires, so the returned function keeps one identity while the
// caller's merged filters (the ones it closes over) change between renders.
export function useDebouncedFilterChange(onFilterChange: FilterChangeHandler): FilterChangeHandler {
  const latest = React.useRef(onFilterChange);
  latest.current = onFilterChange;

  const debounced = React.useMemo(() => debounce((value: string) => latest.current(value), DELAY), []);
  React.useEffect(() => () => debounced.cancel(), [ debounced ]);

  return debounced;
}

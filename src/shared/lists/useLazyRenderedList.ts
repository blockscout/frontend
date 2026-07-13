// SPDX-License-Identifier: LicenseRef-Blockscout

import { clamp } from 'es-toolkit';
import React from 'react';
import { useInView } from 'react-intersection-observer';

const STEP = 10;
const MIN_ITEMS_NUM = 20;

export interface Params {
  list: Array<unknown>;
  isEnabled: boolean;
  minItemsNum?: number;
  resetKey?: unknown;
}

// Renders only the first `minItemsNum` items initially and reveals the rest in steps as the
// bottom sentinel scrolls into view. This keeps the initial (blocking) render cheap on pages
// with many heavy rows, without the complexity of full windowing.
//
// `resetKey` is optional: when provided, the revealed window shrinks back to `minItemsNum`
// whenever the key changes. Pass the list itself (or a filter/page key) to reset on a fresh
// dataset — e.g. a filter or pagination change — while leaving it undefined keeps the grown
// window across in-place list updates (e.g. socket prepends), which is the original behavior.
export default function useLazyRenderedList({
  list,
  isEnabled,
  minItemsNum = MIN_ITEMS_NUM,
  resetKey,
}: Params) {
  const [ renderedItemsNum, setRenderedItemsNum ] = React.useState(minItemsNum);
  const [ prevResetKey, setPrevResetKey ] = React.useState(resetKey);

  // reset synchronously during render when the dataset changes, so the very next commit
  // renders the small window instead of the whole list
  // https://react.dev/reference/react/useState#storing-information-from-previous-renders
  if (resetKey !== prevResetKey) {
    setPrevResetKey(resetKey);
    setRenderedItemsNum(minItemsNum);
  }

  const { ref, inView } = useInView({
    rootMargin: '300px',
    triggerOnce: false,
    skip: !isEnabled || list.length <= minItemsNum,
  });

  React.useEffect(() => {
    if (inView) {
      setRenderedItemsNum((prev) => clamp(prev + STEP, 0, list.length));
    }
  }, [ inView, list.length ]);

  return { cutRef: ref, renderedItemsNum };
}

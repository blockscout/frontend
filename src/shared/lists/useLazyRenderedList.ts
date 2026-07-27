// SPDX-License-Identifier: LicenseRef-Blockscout

import { clamp } from 'es-toolkit';
import React from 'react';

const STEP = 10;
const MIN_ITEMS_NUM = 20;
// how far below the viewport the sentinel may sit and still count as reached
const REVEAL_MARGIN = 300;

export interface Params {
  // only the length is read, so `undefined` (no data yet) is accepted — callers don't need to
  // fall back to a fresh `[]` on every render
  list: Array<unknown> | undefined;
  step?: number;
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
  step = STEP,
  minItemsNum = MIN_ITEMS_NUM,
  resetKey,
}: Params) {
  const itemsNum = list?.length ?? 0;

  const [ renderedItemsNum, setRenderedItemsNum ] = React.useState(minItemsNum);
  const [ prevResetKey, setPrevResetKey ] = React.useState(resetKey);

  // reset synchronously during render when the dataset changes, so the very next commit
  // renders the small window instead of the whole list
  // https://react.dev/reference/react/useState#storing-information-from-previous-renders
  if (resetKey !== prevResetKey) {
    setPrevResetKey(resetKey);
    setRenderedItemsNum(minItemsNum);
  }

  const nodeRef = React.useRef<Element | null>(null);

  const cutRef = React.useCallback((node: Element | null) => {
    nodeRef.current = node;
  }, []);

  const hasMore = renderedItemsNum < itemsNum;

  // The reveal is driven by measuring the sentinel on scroll rather than by an IntersectionObserver.
  // An observer only reports threshold *crossings*, and a step usually adds more content than the
  // margin below the sentinel — so every reveal pushes the sentinel back out of the trigger zone and
  // the next one depends on a fresh crossing. When the observer instead stays stuck reporting
  // "intersecting" (it does, once rows are revealed underneath it without an intervening scroll),
  // no crossing is left to report and the list stalls until the user scrolls far enough up to force
  // one. Re-measuring on every scroll frame has no such edge to miss.
  React.useEffect(() => {
    if (!isEnabled || !hasMore) {
      return;
    }

    let frame: number | null = null;

    const reveal = () => {
      frame = null;
      const node = nodeRef.current;

      if (!node || node.getBoundingClientRect().top <= window.innerHeight + REVEAL_MARGIN) {
        setRenderedItemsNum((prev) => clamp(prev + step, 0, itemsNum));
      }
    };

    const schedule = () => {
      if (frame === null) {
        frame = window.requestAnimationFrame(reveal);
      }
    };

    // covers the sentinel already sitting within reach after the previous reveal or on mount,
    // when no scroll follows to trigger the next step
    schedule();

    // capture phase, since scroll events from nested scroll containers don't bubble to window
    window.addEventListener('scroll', schedule, { capture: true, passive: true });
    window.addEventListener('resize', schedule, { passive: true });

    return () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener('scroll', schedule, { capture: true });
      window.removeEventListener('resize', schedule);
    };
  }, [ isEnabled, hasMore, renderedItemsNum, itemsNum, step ]);

  return { cutRef, renderedItemsNum };
}

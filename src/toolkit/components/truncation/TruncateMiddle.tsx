// SPDX-License-Identifier: LicenseRef-Blockscout

// Middle-ellipsis truncation driven by container width: measures a hidden shadow node and
// binary-searches the longest head that fits, keeping a fixed-length tail (0x123...4567).
// Can't be done in pure CSS — a `text-overflow: ellipsis` head + fixed tail leaves an
// unremovable gap between the dots and the tail, so it's computed in JS.

import { chakra } from '@chakra-ui/react';
import { debounce } from 'es-toolkit';
import React, { useCallback, useEffect, useRef } from 'react';
import useFontFaceObserver from 'use-font-face-observer';

import type { TruncateBaseProps } from './types';

import { Skeleton } from '../../chakra/skeleton';
import { Tooltip } from '../../chakra/tooltip';
import { BODY_TYPEFACE, HEADING_TYPEFACE } from '../../theme/foundations/typography';

const TAIL_LENGTH = 4;
const HEAD_MIN_LENGTH = 4;

export interface TruncateMiddleProps extends TruncateBaseProps {
  tailLength?: number;
}

const DEFAULT_FONT_WEIGHT = '400';

export const TruncateMiddle = React.memo(({
  value,
  tailLength = TAIL_LENGTH,
  as = 'span',
  loading,
  tooltip,
  ...styleProps
}: TruncateMiddleProps) => {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [ displayedString, setDisplayedString ] = React.useState(value);

  // The font-face observer needs a concrete weight, so it falls back to 400 when the caller sets
  // none.
  const fontWeightForObserver = String(styleProps.fontWeight ?? DEFAULT_FONT_WEIGHT);

  const isFontFaceLoaded = useFontFaceObserver([
    { family: BODY_TYPEFACE, weight: fontWeightForObserver },
    { family: HEADING_TYPEFACE, weight: fontWeightForObserver },
  ]);

  const calculateString = useCallback(() => {
    const parent = elementRef?.current?.parentNode as HTMLElement;
    if (!parent) {
      return;
    }

    const shadowEl = document.createElement('span');
    shadowEl.style.opacity = '0';
    parent.appendChild(shadowEl);
    shadowEl.textContent = value;

    const parentWidth = getWidth(parent);

    if (getWidth(shadowEl) > parentWidth) {
      const tail = value.slice(-tailLength);
      let leftI = HEAD_MIN_LENGTH;
      let rightI = value.length - tailLength;

      while (rightI - leftI > 1) {
        const medI = ((rightI - leftI) % 2) ? leftI + (rightI - leftI + 1) / 2 : leftI + (rightI - leftI) / 2;
        const res = value.slice(0, medI) + '...' + tail;
        shadowEl.textContent = res;
        if (getWidth(shadowEl) < parentWidth) {
          leftI = medI;
        } else {
          rightI = medI;
        }
      }
      setDisplayedString(value.slice(0, rightI - 1) + '...' + tail);
    } else {
      setDisplayedString(value);
    }

    parent.removeChild(shadowEl);
  }, [ value, tailLength ]);

  // we want to do recalculation when isFontFaceLoaded flag is changed
  // but we don't want to create more resize event listeners
  // that's why there are separate useEffect hooks
  useEffect(() => {
    calculateString();
  }, [ calculateString, isFontFaceLoaded ]);

  useEffect(() => {
    const resizeHandler = debounce(calculateString, 100);
    const resizeObserver = new ResizeObserver(resizeHandler);

    resizeObserver.observe(document.body);
    return function cleanup() {
      resizeObserver.unobserve(document.body);
    };
  }, [ calculateString ]);

  const content = (
    <Skeleton loading={ loading } asChild>
      <chakra.span ref={ elementRef } as={ as } { ...styleProps }>{ displayedString }</chakra.span>
    </Skeleton>
  );
  const isTruncated = value !== displayedString;

  if (tooltip !== false && (isTruncated || tooltip?.always)) {
    const { content: tooltipContent, always, ...rest } = tooltip ?? {};
    return (
      <Tooltip
        content={ tooltipContent ?? value }
        contentProps={{ maxW: { base: 'calc(100vw - 8px)', lg: '400px' } }}
        { ...rest }
      >
        { content }
      </Tooltip>
    );
  }

  return content;
});

function getWidth(el: HTMLElement) {
  return el.getBoundingClientRect().width;
}

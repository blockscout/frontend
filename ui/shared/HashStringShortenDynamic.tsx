// this component trims hash string like 0x123...4567 (always 4 chars after dots)
// or shows full hash string, if fits

// i can't do this with pure css. if you can, feel free to replace it

// if i use <span text-overflow=ellipsis>some chars</span><span>last 4 chars</span>
// i have an unremovable gap between dots and second span

// so i did it with js

import type { As } from '@chakra-ui/react';
import { Tooltip, chakra } from '@chakra-ui/react';
import _debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useRef } from 'react';
import type { FontFace } from 'use-font-face-observer';
import useFontFaceObserver from 'use-font-face-observer';

import { BODY_TYPEFACE, HEADING_TYPEFACE } from 'theme/foundations/typography';

const TAIL_LENGTH = 4;
const HEAD_MIN_LENGTH = 4;

interface Props {
  hash: string;
  fontWeight?: string | number;
  isTooltipDisabled?: boolean;
  tailLength?: number;
  as?: As;
}

const HashStringShortenDynamic = ({ hash, fontWeight = '400', isTooltipDisabled, tailLength = TAIL_LENGTH, as = 'span' }: Props) => {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [ displayedString, setDisplayedString ] = React.useState(hash);

  const isFontFaceLoaded = useFontFaceObserver([
    { family: BODY_TYPEFACE, weight: String(fontWeight) as FontFace['weight'] },
    { family: HEADING_TYPEFACE, weight: String(fontWeight) as FontFace['weight'] },
  ]);

  const calculateString = useCallback(() => {
    const parent = elementRef?.current?.parentNode as HTMLElement;
    if (!parent) {
      return;
    }

    const shadowEl = document.createElement('span');
    shadowEl.style.opacity = '0';
    parent.appendChild(shadowEl);
    shadowEl.textContent = hash;

    const parentWidth = getWidth(parent);

    if (getWidth(shadowEl) > parentWidth) {
      const tail = hash.slice(-tailLength);
      let leftI = HEAD_MIN_LENGTH;
      let rightI = hash.length - tailLength;

      while (rightI - leftI > 1) {
        const medI = ((rightI - leftI) % 2) ? leftI + (rightI - leftI + 1) / 2 : leftI + (rightI - leftI) / 2;
        const res = hash.slice(0, medI) + '...' + tail;
        shadowEl.textContent = res;
        if (getWidth(shadowEl) < parentWidth) {
          leftI = medI;
        } else {
          rightI = medI;
        }
      }
      setDisplayedString(hash.slice(0, rightI - 1) + '...' + tail);
    } else {
      setDisplayedString(hash);
    }

    parent.removeChild(shadowEl);
  }, [ hash, tailLength ]);

  // we want to do recalculation when isFontFaceLoaded flag is changed
  // but we don't want to create more resize event listeners
  // that's why there are separate useEffect hooks
  useEffect(() => {
    calculateString();
  }, [ calculateString, isFontFaceLoaded ]);

  useEffect(() => {
    const resizeHandler = _debounce(calculateString, 100);
    const resizeObserver = new ResizeObserver(resizeHandler);

    resizeObserver.observe(document.body);
    return function cleanup() {
      resizeObserver.unobserve(document.body);
    };
  }, [ calculateString ]);

  const content = <chakra.span ref={ elementRef } as={ as }>{ displayedString }</chakra.span>;
  const isTruncated = hash.length !== displayedString.length;

  if (isTruncated) {
    return (
      <Tooltip label={ hash } isDisabled={ isTooltipDisabled } maxW={{ base: '100vw', lg: '400px' }}>{ content }</Tooltip>
    );
  }

  return content;
};

function getWidth(el: HTMLElement) {
  return el.getBoundingClientRect().width;
}

export default React.memo(HashStringShortenDynamic);

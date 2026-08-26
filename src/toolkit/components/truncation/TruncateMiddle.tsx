// SPDX-License-Identifier: LicenseRef-Blockscout

// Middle-ellipsis truncation driven by container width: measures candidate strings with the
// Canvas 2D API and binary-searches the longest head that fits, keeping a fixed-length tail
// (0x123...4567). Can't be done in pure CSS — a `text-overflow: ellipsis` head + fixed tail
// leaves an unremovable gap between the dots and the tail, so it's computed in JS. measureText
// returns text width without touching layout, so the binary search never forces a reflow.

import { chakra } from '@chakra-ui/react';
import { debounce } from 'es-toolkit';
import React, { useCallback, useEffect, useRef } from 'react';
import useFontFaceObserver from 'use-font-face-observer';

import type { TruncateBaseProps } from './types';

import { Skeleton } from '../../chakra/skeleton';
import { Tooltip } from '../../chakra/tooltip';
import { BODY_TYPEFACE, HEADING_TYPEFACE } from '../../theme/foundations/typography';
import { SECOND } from '../../utils/consts';

const TAIL_LENGTH = 4;
const HEAD_MIN_LENGTH = 4;
const DEFAULT_FONT_WEIGHT = '400';
const RESIZE_DEBOUNCE = SECOND / 10;

export interface TruncateMiddleProps extends TruncateBaseProps {
  tailLength?: number;
}

// One offscreen canvas is reused across every TruncateMiddle instance: measureText is
// synchronous and calculateString never yields, so instances can't interleave measurements.
// `undefined` means "not created yet"; `null` means getContext failed (non-browser env).
let sharedContext: CanvasRenderingContext2D | null | undefined;

function getMeasureContext(): CanvasRenderingContext2D | null {
  if (sharedContext === undefined) {
    sharedContext = document.createElement('canvas').getContext('2d');
  }
  return sharedContext;
}

// Canvas needs at least weight + size + family; getComputedStyle(el).font returns '' in Chrome,
// so the shorthand is assembled from the individual resolved properties instead.
function getFontString(styles: CSSStyleDeclaration): string {
  return `${ styles.fontStyle } ${ styles.fontWeight } ${ styles.fontSize } ${ styles.fontFamily }`;
}

// measureText returns advance width only, so any letter-spacing (added after every glyph) has to
// be folded back in by hand. Resolves to 0 for the usual `normal`.
function getLetterSpacing(styles: CSSStyleDeclaration): number {
  const value = parseFloat(styles.letterSpacing);
  return Number.isNaN(value) ? 0 : value;
}

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
    const element = elementRef.current;
    const parent = element?.parentNode as HTMLElement | null;
    if (!element || !parent) {
      return;
    }

    const context = getMeasureContext();
    if (!context) {
      setDisplayedString(value);
      return;
    }

    // Read the fully-resolved font off the rendered span (cascade + textStyle + overrides), once
    // per recalculation — the font is invariant across the binary search below.
    const styles = window.getComputedStyle(element);
    context.font = getFontString(styles);
    const letterSpacing = getLetterSpacing(styles);
    const measure = (text: string) => context.measureText(text).width + letterSpacing * text.length;

    // A shrink-to-fit container only exposes its available width while the span holds full-length
    // content, so briefly fill the span before reading the container box. Written straight to the
    // node (not through state) so the read lands in the same synchronous frame.
    element.textContent = value;
    const parentWidth = getWidth(parent);
    const fullWidth = getWidth(element);

    // measureText sums ideal glyph advances and runs a fraction of a percent wider than the
    // browser's actual sub-pixel text layout — enough to truncate a value that really fits when
    // its full width sits a pixel or two under the container. `fullWidth` is that same string laid
    // out for real (read for free in the reflow above), so scale every canvas measurement by the
    // observed ratio to bring the binary search back in line with what the DOM will render.
    const canvasFullWidth = measure(value);
    const calibration = canvasFullWidth > 0 ? fullWidth / canvasFullWidth : 1;
    const fits = (text: string) => measure(text) * calibration < parentWidth;

    let result = value;
    if (
      fullWidth > parentWidth &&
      // Only truncate when there is room for at least a HEAD_MIN_LENGTH head before the tail.
      // Otherwise the search below never iterates and the head would run into the tail, emitting a
      // garbled string longer than the input (e.g. 'abcd' → 'abc...abcd'), so keep the full value.
      value.length - tailLength > HEAD_MIN_LENGTH
    ) {
      const tail = value.slice(-tailLength);
      const maxHeadLength = value.length - tailLength;
      const withHead = (headLength: number) => value.slice(0, headLength) + '...' + tail;

      let leftI = HEAD_MIN_LENGTH;
      let rightI = maxHeadLength;
      while (rightI - leftI > 1) {
        const medI = ((rightI - leftI) % 2) ? leftI + (rightI - leftI + 1) / 2 : leftI + (rightI - leftI) / 2;
        if (fits(withHead(medI))) {
          leftI = medI;
        } else {
          rightI = medI;
        }
      }

      // The calibrated canvas search lands within a character of the true fit but can't reproduce
      // the browser's per-glyph rounding exactly. Settle the final head length against real layout
      // — a couple of reflows, versus one per iteration if the whole search measured the DOM — so
      // the head is exactly as long as the container allows and matches what the DOM renders.
      let headLength = leftI;
      const headFits = (length: number) => {
        element.textContent = withHead(length);
        return getWidth(element) < parentWidth;
      };
      while (headLength < maxHeadLength && headFits(headLength + 1)) {
        headLength++;
      }
      while (headLength > HEAD_MIN_LENGTH && !headFits(headLength)) {
        headLength--;
      }

      result = withHead(headLength);
    }

    // Restore before React reconciles: setDisplayedString bails out when the value is unchanged,
    // which would otherwise leave the full-length text written above on screen.
    element.textContent = result;
    setDisplayedString(result);
  }, [ value, tailLength ]);

  // we want to do recalculation when isFontFaceLoaded flag is changed
  // but we don't want to create more resize event listeners
  // that's why there are separate useEffect hooks
  useEffect(() => {
    calculateString();
  }, [ calculateString, isFontFaceLoaded ]);

  // Observes document.body, not the component's own parent: the truncated span usually sits inside
  // a shrink-to-fit container that doesn't grow when the viewport widens (only an outer block
  // ancestor does), so a parent-scoped observer never fires on widen and the text stays stuck at
  // its narrowest width.
  useEffect(() => {
    const resizeHandler = debounce(calculateString, RESIZE_DEBOUNCE);
    const resizeObserver = new ResizeObserver(resizeHandler);

    resizeObserver.observe(document.body);
    return function cleanup() {
      resizeObserver.disconnect();
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

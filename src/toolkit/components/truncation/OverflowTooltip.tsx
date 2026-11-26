// SPDX-License-Identifier: LicenseRef-Blockscout

import { debounce } from 'es-toolkit';
import React from 'react';
import useFontFaceObserver from 'use-font-face-observer';

import type { TooltipProps } from '../../chakra/tooltip';
import { Tooltip } from '../../chakra/tooltip';
import { BODY_TYPEFACE } from '../../theme/foundations/typography';

export interface OverflowTooltipProps extends TooltipProps {
  always?: boolean;
}

export const OverflowTooltip = React.memo(({ children, always, ...rest }: OverflowTooltipProps) => {
  const childRef = React.useRef<HTMLElement>(null);
  const [ isTruncated, setTruncated ] = React.useState(false);

  const isFontFaceLoaded = useFontFaceObserver([
    { family: BODY_TYPEFACE },
  ]);

  const updatedTruncateState = React.useCallback(() => {
    if (childRef.current) {
      const scrollWidth = childRef.current.scrollWidth;
      const clientWidth = childRef.current.clientWidth;

      if (scrollWidth > clientWidth) {
        setTruncated(true);
      } else {
        setTruncated(false);
      }
    }
  }, []);

  // FIXME: that should be useLayoutEffect, but it keeps complaining about SSR
  // let's keep it as it is until the first issue
  React.useEffect(() => {
    updatedTruncateState();
  }, [ updatedTruncateState, isFontFaceLoaded ]);

  // we want to do recalculation when isFontFaceLoaded flag is changed
  // but we don't want to create more resize event listeners
  // that's why there are separate useEffect hooks
  React.useEffect(() => {
    const handleResize = debounce(updatedTruncateState, 1000);
    window.addEventListener('resize', handleResize);

    return function cleanup() {
      window.removeEventListener('resize', handleResize);
    };
  }, [ updatedTruncateState ]);

  // as for now it supports only one child
  // and it is not cleared how to manage case with two or more children
  const child = React.Children.only(children) as React.ReactElement;

  // The open state must stay with Tooltip: a controlled `open` makes the lazy Tooltip remount
  // the trigger node on hover, and the browser never reports the pointer leaving the new node.
  const modifiedChildren = React.cloneElement(
    child,
    { ref: childRef } as React.HTMLAttributes<HTMLElement>,
  );

  if (isTruncated || always) {
    return (
      <Tooltip
        contentProps={{ maxW: { base: 'calc(100vw - 8px)', lg: '400px' } }}
        { ...rest }
      >
        { modifiedChildren }
      </Tooltip>
    );
  }

  return modifiedChildren;
});

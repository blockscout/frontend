// this component trims address like 0x123...4567 (always 4 chars after dots)
// or shows full address, if fits

// i can't do this with pure css. if you can, feel free to replace it

// if i use <span text-overflow=ellipsis>some chars</span><span>last 4 chars</span>
// i have an unremovable gap between dots and second span

// so i did it with js

import { Tooltip } from '@chakra-ui/react';
import _debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useRef } from 'react';
import type { FontFace } from 'use-font-face-observer';
import useFontFaceObserver from 'use-font-face-observer';

import { BODY_TYPEFACE } from 'theme/foundations/typography';

const TAIL_LENGTH = 4;
const HEAD_MIN_LENGTH = 4;

interface Props {
  address: string;
  fontWeight: string | number;
  truncated?: boolean;
}

const shortenAddress = (address: string) => address.slice(0, 4) + '...' + address.slice(-4);

const AddressWithDots = ({ address, fontWeight, truncated }: Props) => {
  const addressRef = useRef<HTMLSpanElement>(null);
  const [ displayedAddress, setAddress ] = React.useState(truncated ? shortenAddress(address) : address);

  const isFontFaceLoaded = useFontFaceObserver([
    { family: BODY_TYPEFACE, weight: String(fontWeight) as FontFace['weight'] },
  ]);

  const calculateString = useCallback(() => {
    const addressEl = addressRef.current;
    if (!addressEl) {
      return;
    }

    const parent = addressRef?.current?.parentNode as HTMLElement;
    if (!parent) {
      return;
    }

    const shadowEl = document.createElement('span');
    shadowEl.style.opacity = '0';
    parent.appendChild(shadowEl);
    shadowEl.textContent = address;

    const parentWidth = getWidth(parent);

    if (getWidth(shadowEl) > parentWidth) {
      for (let i = 1; i <= address.length - TAIL_LENGTH - HEAD_MIN_LENGTH; i++) {
        const res = address.slice(0, address.length - i - TAIL_LENGTH) + '...' + address.slice(-TAIL_LENGTH);
        shadowEl.textContent = res;
        if (getWidth(shadowEl) < parentWidth || i === address.length - TAIL_LENGTH - HEAD_MIN_LENGTH) {
          setAddress(res);
          break;
        }
      }
    } else {
      setAddress(address);
    }

    parent.removeChild(shadowEl);
  }, [ address ]);

  // we want to do recalculation when isFontFaceLoaded flag is changed
  // but we don't want to create more resize event listeners
  // that's why there are separate useEffect hooks
  useEffect(() => {
    !truncated && calculateString();
  }, [ calculateString, isFontFaceLoaded, truncated ]);

  useEffect(() => {
    if (!truncated) {
      const resizeHandler = _debounce(calculateString, 100);
      const resizeObserver = new ResizeObserver(resizeHandler);

      resizeObserver.observe(document.body);
      return function cleanup() {
        resizeObserver.unobserve(document.body);
      };
    }
  }, [ calculateString, truncated ]);

  const content = <span ref={ addressRef }>{ displayedAddress }</span>;
  const isTruncated = truncated || address.length !== displayedAddress.length;

  if (isTruncated) {
    return (
      <Tooltip label={ address }>{ content }</Tooltip>
    );
  }

  return content;
};

function getWidth(el: HTMLElement) {
  return el.getBoundingClientRect().width;
}

export default React.memo(AddressWithDots);

// this component trims address like 0x123...4567 (always 4 chars after dots)
// or shows full address, if fits

// i can't do this with pure css. if you can, feel free to replace it

// if i use <span text-overflow=ellipsis>some chars</span><span>last 4 chars</span>
// i have an unremovable gap between dots and second span

// so i did it with js

import React, { useCallback, useEffect, useRef } from 'react';
import _debounce from 'lodash/debounce';

const TAIL_LENGTH = 4;
const HEAD_MIN_LENGTH = 4;

const AddressWithDots = ({ address }: {address: string}) => {
  const addressRef = useRef<HTMLSpanElement>(null);

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
          addressRef.current.textContent = res;
          break;
        }
      }
    } else {
      addressRef.current.textContent = address;
    }
    parent.removeChild(shadowEl);
  }, [ address ]);

  useEffect(() => {
    calculateString();
    const resizeHandler = _debounce(calculateString, 50)
    window.addEventListener('resize', resizeHandler)
    return function cleanup() {
      window.removeEventListener('resize', resizeHandler)
    };
  }, [ calculateString ]);
  return <span ref={ addressRef }>{ address }</span>;
}

function getWidth(el: HTMLElement) {
  return el.getBoundingClientRect().width;
}

export default AddressWithDots;

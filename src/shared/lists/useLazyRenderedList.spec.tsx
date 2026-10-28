// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from 'vitest/lib';

import useLazyRenderedList from './useLazyRenderedList';

const ITEM_HEIGHT = 50;
const VIEWPORT_HEIGHT = 1000;
// the hook reveals while the sentinel sits within the viewport + its own 300px margin
const REVEAL_THRESHOLD = VIEWPORT_HEIGHT + 300;

// the sentinel sits below every rendered item, so revealing pushes it further down, and
// scrolling pulls it back up — exactly the geometry that makes each step land out of reach
let scrollTop = 0;
let renderedItemsNum = 0;

const sentinelTop = () => renderedItemsNum * ITEM_HEIGHT - scrollTop;

let scrollContainerBottom = 0;

interface Props {
  list: Array<number>;
  step?: number;
  resetKey?: unknown;
}

const TestList = ({ list, step, resetKey }: Props) => {
  const result = useLazyRenderedList({ list, isEnabled: true, step, resetKey });
  renderedItemsNum = result.renderedItemsNum;

  return (
    <div>
      <span data-testid="num">{ result.renderedItemsNum }</span>
      <div ref={ result.cutRef } data-testid="cut"/>
    </div>
  );
};

const TestListInScrollContainer = ({ list, resetKey }: Pick<Props, 'list' | 'resetKey'>) => {
  const result = useLazyRenderedList({ list, isEnabled: true, resetKey });
  renderedItemsNum = result.renderedItemsNum;

  return (
    <div ref={ result.scrollContainerRef } data-testid="scroll-container">
      <span data-testid="num">{ result.renderedItemsNum }</span>
      <div ref={ result.cutRef } data-testid="cut"/>
    </div>
  );
};

const getRect = (element: Element): Pick<DOMRect, 'top' | 'bottom'> => {
  switch (element.getAttribute('data-testid')) {
    case 'cut':
      return { top: sentinelTop(), bottom: sentinelTop() };
    case 'scroll-container':
      return { top: 0, bottom: scrollContainerBottom };
    default:
      return { top: 0, bottom: 0 };
  }
};

// the reveal cascade advances one animation frame at a time, each step re-arming the next
const flushFrames = (framesNum = 10) => {
  for (let i = 0; i < framesNum; i++) {
    act(() => {
      vi.advanceTimersByTime(20);
    });
  }
};

const scrollTo = (value: number) => {
  scrollTop = value;
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
  flushFrames();
};

const getRenderedNum = () => Number(screen.getByTestId('num').textContent);

describe('useLazyRenderedList', () => {
  beforeEach(() => {
    scrollTop = 0;
    renderedItemsNum = 0;
    scrollContainerBottom = 0;
    vi.useFakeTimers();
    vi.stubGlobal('innerHeight', VIEWPORT_HEIGHT);
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function(this: Element) {
      return { ...getRect(this), height: 0, width: 0, left: 0, right: 0, x: 0, y: 0, toJSON: () => ({}) };
    });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('stops revealing once the sentinel is pushed out of reach', () => {
    render(<TestList list={ Array.from({ length: 500 }, (_, i) => i) }/>);
    flushFrames();

    // 20 rendered puts the sentinel at 1000 (in reach), 30 puts it at 1500 (out of reach)
    expect(getRenderedNum()).toBe(30);
    expect(sentinelTop()).toBeGreaterThan(REVEAL_THRESHOLD);
  });

  // regression: an IntersectionObserver only reports crossings, so once a reveal left the sentinel
  // out of reach while the observer still considered it intersecting, scrolling back down produced
  // no callback and the list stalled forever
  it('keeps revealing on scroll after a step left the sentinel out of reach', () => {
    render(<TestList list={ Array.from({ length: 500 }, (_, i) => i) }/>);
    flushFrames();
    expect(getRenderedNum()).toBe(30);

    scrollTo(400);
    expect(getRenderedNum()).toBe(40);

    scrollTo(800);
    expect(getRenderedNum()).toBe(50);
  });

  it('never reveals past the end of the list', () => {
    render(<TestList list={ Array.from({ length: 25 }, (_, i) => i) }/>);
    flushFrames();
    scrollTo(5000);

    expect(getRenderedNum()).toBe(25);
  });

  it('does not reveal while the sentinel is far below the viewport', () => {
    render(<TestList list={ Array.from({ length: 500 }, (_, i) => i) }/>);
    flushFrames();
    expect(getRenderedNum()).toBe(30);

    scrollTo(-5000);
    expect(getRenderedNum()).toBe(30);
  });

  // regression: a table scrolling in its own box that ends below the fold stalled at the first window,
  // since the sentinel never came within reach of the viewport edge however far the box was scrolled
  it('reveals once the sentinel nears the bottom of a scroll container that ends below the viewport', () => {
    scrollContainerBottom = 2000;
    render(<TestListInScrollContainer list={ Array.from({ length: 500 }, (_, i) => i) }/>);
    flushFrames();

    // 40 rendered puts the sentinel at 2000 (in reach of the container), 50 puts it at 2500 (out of reach)
    expect(getRenderedNum()).toBe(50);

    scrollTo(600);
    expect(getRenderedNum()).toBe(60);
  });

  it('measures a sentinel in a scroll container against the container, not the viewport', () => {
    scrollContainerBottom = 500;
    render(<TestListInScrollContainer list={ Array.from({ length: 500 }, (_, i) => i) }/>);
    flushFrames();

    // the sentinel at 1000 is within the viewport's reach, but not the container's (500 + 300)
    expect(getRenderedNum()).toBe(20);
  });

  it('shrinks the window back when the reset key changes', () => {
    const list = Array.from({ length: 500 }, (_, i) => i);
    const { rerender } = render(<TestList list={ list } resetKey="a"/>);
    scrollTo(400);
    expect(getRenderedNum()).toBe(40);

    scrollTop = 5000;
    rerender(<TestList list={ list } resetKey="b"/>);

    expect(getRenderedNum()).toBe(20);
  });

  it('scrolls the scroll container back to the top when the reset key changes', () => {
    const list = Array.from({ length: 500 }, (_, i) => i);
    const { rerender } = render(<TestListInScrollContainer list={ list } resetKey="a"/>);
    const container = screen.getByTestId('scroll-container');
    container.scrollTop = 800;

    rerender(<TestListInScrollContainer list={ list } resetKey="b"/>);

    expect(container.scrollTop).toBe(0);
  });
});

// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import { afterEach, expect, it } from 'vitest';

import { centerInScrollParent } from './center-in-scroll-parent';

interface Layout {
  readonly rowTop: number;
  readonly overflowY: string;
  readonly scrollTop: number;
}

function mountRow({ rowTop, overflowY, scrollTop }: Layout): { row: HTMLElement; scrollParent: HTMLElement } {
  const scrollParent = document.createElement('div');
  const wrapper = document.createElement('div');
  const row = document.createElement('div');

  scrollParent.style.overflowY = overflowY;
  scrollParent.scrollTop = scrollTop;
  Object.defineProperty(scrollParent, 'clientHeight', { value: 222 });
  scrollParent.getBoundingClientRect = () => new DOMRect(0, 100, 250, 222);
  row.getBoundingClientRect = () => new DOMRect(0, rowTop, 250, 22);

  wrapper.append(row);
  scrollParent.append(wrapper);
  document.body.append(scrollParent);

  return { row, scrollParent };
}

afterEach(() => {
  document.body.replaceChildren();
});

it('scrolls the nearest scrollable ancestor down to center a row below its middle', () => {
  const { row, scrollParent } = mountRow({ rowTop: 700, overflowY: 'scroll', scrollTop: 50 });

  centerInScrollParent(row);

  expect(scrollParent.scrollTop).toBe(550);
});

it('scrolls up to center a row above the middle', () => {
  const { row, scrollParent } = mountRow({ rowTop: 100, overflowY: 'auto', scrollTop: 400 });

  centerInScrollParent(row);

  expect(scrollParent.scrollTop).toBe(300);
});

it('leaves an ancestor that does not scroll where it is', () => {
  const { row, scrollParent } = mountRow({ rowTop: 700, overflowY: 'visible', scrollTop: 50 });

  centerInScrollParent(row);

  expect(scrollParent.scrollTop).toBe(50);
});

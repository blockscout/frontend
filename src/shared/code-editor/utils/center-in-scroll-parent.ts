// SPDX-License-Identifier: LicenseRef-Blockscout

const SCROLLABLE_OVERFLOW = new Set([ 'auto', 'scroll' ]);

export function centerInScrollParent(element: HTMLElement): void {
  const scrollParent = findScrollParent(element);

  if (!scrollParent) {
    return;
  }

  const elementRect = element.getBoundingClientRect();
  const parentRect = scrollParent.getBoundingClientRect();
  const offsetFromParentTop = elementRect.top - parentRect.top;

  scrollParent.scrollTop += offsetFromParentTop - (scrollParent.clientHeight - elementRect.height) / 2;
}

function findScrollParent(element: HTMLElement): HTMLElement | null {
  let parent = element.parentElement;

  while (parent && !SCROLLABLE_OVERFLOW.has(window.getComputedStyle(parent).overflowY)) {
    parent = parent.parentElement;
  }

  return parent;
}

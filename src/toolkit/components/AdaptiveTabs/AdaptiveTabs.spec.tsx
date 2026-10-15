// @vitest-environment jsdom

import React from 'react';

import type { TabItem } from './types';

import { expect, test } from 'vitest';
import { act, render, screen } from 'vitest/lib';

import AdaptiveTabs from './AdaptiveTabs';

const SUSPENSE_DURATION = 50;

let pending: Promise<void> | undefined;
let resolved = false;

const SuspendingContent = () => {
  if (!resolved) {
    pending ??= new Promise((resolve) => setTimeout(() => {
      resolved = true;
      resolve();
    }, SUSPENSE_DURATION));
    throw pending;
  }
  return <div>second content</div>;
};

const TABS: Array<TabItem> = [
  { id: 'first', title: 'First', component: <div>first content</div> },
  { id: 'second', title: 'Second', component: <SuspendingContent/> },
];

test('hides the previous tab when the newly selected tab suspends on mount', async() => {
  const { rerender } = render(
    <React.Suspense fallback={ null }>
      <AdaptiveTabs tabs={ TABS } defaultValue="first"/>
    </React.Suspense>,
  );
  await screen.findByText('first content');

  rerender(
    <React.Suspense fallback={ null }>
      <AdaptiveTabs tabs={ TABS } defaultValue="second"/>
    </React.Suspense>,
  );
  await act(() => new Promise((resolve) => setTimeout(resolve, 4 * SUSPENSE_DURATION)));

  expect(screen.getAllByRole('tabpanel').map((panel) => panel.textContent)).toEqual([ 'second content' ]);
});

// @vitest-environment jsdom

import React from 'react';

import useIsMounted from 'src/shared/hooks/useIsMounted';

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from 'vitest/lib';

import LayoutBare from './LayoutBare';

// pages render on the client only, so a page crashes once the layout is past its mount gate
const Crash = () => {
  const isMounted = useIsMounted();
  if (isMounted) {
    throw new Error('Page crashed');
  }
  return null;
};

beforeEach(() => {
  // the boundary re-throws the page error to the console; keep the run readable
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(cleanup);

describe('bare layout', () => {
  it('renders the page alone in the main landmark, without the app chrome', () => {
    const { container } = render(<LayoutBare><p>Receipt card</p></LayoutBare>);

    expect(screen.getByRole('main').textContent).toBe('Receipt card');
    expect(container.querySelector('header, footer, nav')).toBeNull();
  });

  it('shows the error screen instead of a page that crashed', () => {
    render(<LayoutBare><Crash/></LayoutBare>);

    expect(screen.queryByRole('main')).toBeNull();
    expect(screen.getByRole('button', { name: 'Back to home' })).toBeTruthy();
  });
});

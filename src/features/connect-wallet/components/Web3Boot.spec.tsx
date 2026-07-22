// @vitest-environment jsdom

import React from 'react';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest/lib';

import Web3Boot from './Web3Boot';

const runtimeMock = vi.hoisted(() => ({
  startWeb3Runtime: vi.fn(),
  applyThemeMode: vi.fn(),
}));

const colorModeMock = vi.hoisted(() => ({ value: 'light' as 'light' | 'dark' | undefined }));

vi.mock('src/features/connect-wallet/utils/runtime', () => ({
  startWeb3Runtime: runtimeMock.startWeb3Runtime,
  applyThemeMode: runtimeMock.applyThemeMode,
}));

vi.mock('src/toolkit/chakra/color-mode', () => ({
  useColorMode: () => ({ colorMode: colorModeMock.value }),
}));

describe('Web3Boot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    colorModeMock.value = 'light';
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('starts the runtime once on mount', () => {
    render(<Web3Boot/>);
    expect(runtimeMock.startWeb3Runtime).toHaveBeenCalledTimes(1);
  });

  it('syncs the AppKit theme with the color mode, and again when it changes', () => {
    const { rerender } = render(<Web3Boot/>);
    expect(runtimeMock.applyThemeMode).toHaveBeenCalledWith('light');

    colorModeMock.value = 'dark';
    rerender(<Web3Boot/>);
    expect(runtimeMock.applyThemeMode).toHaveBeenCalledWith('dark');
  });

  it('defaults the theme to light when the color mode is undefined', () => {
    colorModeMock.value = undefined;
    render(<Web3Boot/>);
    expect(runtimeMock.applyThemeMode).toHaveBeenCalledWith('light');
  });
});

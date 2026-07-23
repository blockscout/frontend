// @vitest-environment jsdom

import React from 'react';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from 'vitest/lib';

import { Web3Provider, useIsWeb3Ready } from './context';
import type { Web3Runtime } from './utils/runtime';

const holder = vi.hoisted(() => ({ loadedCb: undefined as ((runtime: Web3Runtime) => void) | undefined }));

const runtimeMock = vi.hoisted(() => ({
  applyThemeMode: vi.fn(),
  ensureLoaded: vi.fn(),
  subscribeRuntimeLoaded: vi.fn(),
}));

const bridgeMock = vi.hoisted(() => ({
  reset: vi.fn(),
  hasPersistedConnection: vi.fn(() => false),
}));

const colorModeMock = vi.hoisted(() => ({ colorMode: 'light' as 'light' | 'dark' }));
const innerMock = vi.hoisted(() => ({ shouldFailImport: false }));

// isReownMode is computed once at module eval from this payload, so the whole spec exercises reown mode —
// the only mode where the eager reconnect runs (non-reown modes simply skip it).
vi.mock('src/config', () => ({ 'default': { features: { connectWallet: { isEnabled: true } } } }));
vi.mock('src/config/utils/features', () => ({ getFeaturePayload: () => ({ connectorType: 'reown' }) }));

vi.mock('src/toolkit/chakra/color-mode', () => ({ useColorMode: () => ({ colorMode: colorModeMock.colorMode }) }));

vi.mock('./utils/bridge', () => bridgeMock);
vi.mock('./utils/runtime', () => ({
  applyThemeMode: runtimeMock.applyThemeMode,
  ensureLoaded: runtimeMock.ensureLoaded,
  subscribeRuntimeLoaded: runtimeMock.subscribeRuntimeLoaded,
}));

vi.mock('./components/Web3ProviderInner', () => ({
  // a getter so a test can make the dynamic `import('./components/Web3ProviderInner')` reject (chunk-load failure)
  get 'default'() {
    if (innerMock.shouldFailImport) {
      throw new Error('inner chunk load failed');
    }
    return ({ reconnectOnMount }: { reconnectOnMount: boolean }) => (
      <div data-testid="inner">inner:{ String(reconnectOnMount) }</div>
    );
  },
}));

const readyRuntime = { config: { id: 'wagmi-config' } } as unknown as Web3Runtime;
const failedRuntime = { config: undefined } as unknown as Web3Runtime;

const ReadyProbe = () => <div>ready:{ String(useIsWeb3Ready()) }</div>;

describe('Web3Provider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    holder.loadedCb = undefined;
    colorModeMock.colorMode = 'light';
    innerMock.shouldFailImport = false;
    bridgeMock.hasPersistedConnection.mockReturnValue(false);
    runtimeMock.subscribeRuntimeLoaded.mockImplementation((cb: (runtime: Web3Runtime) => void) => {
      holder.loadedCb = cb;
      return () => {};
    });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders the app immediately and mounts the wallet provider only as a later sibling', async() => {
    render(
      <Web3Provider>
        <div>app</div>
        <ReadyProbe/>
      </Web3Provider>,
    );

    // the app is present from the first paint, before any wallet chunk loads
    expect(screen.queryByText('app')).not.toBeNull();
    expect(screen.queryByText('ready:false')).not.toBeNull();
    expect(screen.queryByTestId('inner')).toBeNull();

    await act(async() => {
      holder.loadedCb?.(readyRuntime);
      await Promise.resolve();
    });

    // the app node is untouched; the provider appears as a trailing sibling and readiness flips
    expect(screen.queryByText('app')).not.toBeNull();
    expect(await screen.findByTestId('inner')).not.toBeNull();
    expect(screen.queryByText('ready:true')).not.toBeNull();
  });

  it('passes reconnectOnMount from the persisted-connection flag', async() => {
    bridgeMock.hasPersistedConnection.mockReturnValue(true);
    render(<Web3Provider><div>app</div></Web3Provider>);

    await act(async() => {
      holder.loadedCb?.(readyRuntime);
      await Promise.resolve();
    });

    expect((await screen.findByTestId('inner')).textContent).toBe('inner:true');
  });

  it('resets the bridge and mounts no provider when the runtime load fails (no config)', async() => {
    render(
      <Web3Provider>
        <div>app</div>
        <ReadyProbe/>
      </Web3Provider>,
    );

    await act(async() => {
      holder.loadedCb?.(failedRuntime);
      await Promise.resolve();
    });

    expect(bridgeMock.reset).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('inner')).toBeNull();
    expect(screen.queryByText('ready:false')).not.toBeNull();
    expect(screen.queryByText('app')).not.toBeNull();
  });

  it('degrades (no stuck fallback) when the inner provider chunk fails after the runtime loaded', async() => {
    innerMock.shouldFailImport = true;

    render(
      <Web3Provider>
        <div>app</div>
        <ReadyProbe/>
      </Web3Provider>,
    );

    await act(async() => {
      holder.loadedCb?.(readyRuntime);
      await Promise.resolve();
    });

    // no sibling mounted, but readiness still flips so `Web3Boundary` islands render (and read via the
    // config) instead of being stranded on their skeletons; the header account is reset off the seed
    expect(screen.queryByTestId('inner')).toBeNull();
    expect(screen.queryByText('ready:true')).not.toBeNull();
    expect(bridgeMock.reset).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('app')).not.toBeNull();
  });

  it('keeps the AppKit theme in sync with the color mode', () => {
    const { rerender } = render(<Web3Provider><div>app</div></Web3Provider>);
    expect(runtimeMock.applyThemeMode).toHaveBeenLastCalledWith('light');

    colorModeMock.colorMode = 'dark';
    rerender(<Web3Provider><div>app</div></Web3Provider>);
    expect(runtimeMock.applyThemeMode).toHaveBeenLastCalledWith('dark');
  });

  describe('eager reconnect (returning reown user)', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      // force the setTimeout fallback path so fake timers drive the idle schedule deterministically
      Reflect.deleteProperty(window, 'requestIdleCallback');
    });

    it('loads the runtime once idle when a connection is persisted', () => {
      bridgeMock.hasPersistedConnection.mockReturnValue(true);
      render(<Web3Provider><div>app</div></Web3Provider>);

      expect(runtimeMock.ensureLoaded).not.toHaveBeenCalled();
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(runtimeMock.ensureLoaded).toHaveBeenCalledTimes(1);
    });

    it('does not eager-load when nothing is persisted', () => {
      bridgeMock.hasPersistedConnection.mockReturnValue(false);
      render(<Web3Provider><div>app</div></Web3Provider>);

      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(runtimeMock.ensureLoaded).not.toHaveBeenCalled();
    });

    it('waits for a typing pause before loading (does not interrupt input focus)', () => {
      bridgeMock.hasPersistedConnection.mockReturnValue(true);

      const input = document.createElement('input');
      document.body.appendChild(input);
      input.focus();

      render(<Web3Provider><div>app</div></Web3Provider>);

      act(() => {
        vi.advanceTimersByTime(200);
      });
      // an input is focused → the attempt reschedules instead of loading mid-keystroke
      expect(runtimeMock.ensureLoaded).not.toHaveBeenCalled();

      input.blur();
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(runtimeMock.ensureLoaded).toHaveBeenCalledTimes(1);

      document.body.removeChild(input);
    });
  });
});

// @vitest-environment jsdom

import React from 'react';

import type { Web3Runtime } from 'src/features/connect-wallet/utils/runtime';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';

import Web3Boundary from './Web3Boundary';

const runtimeMock = vi.hoisted(() => ({
  ensureLoaded: vi.fn(),
}));

// Mock `wagmi` with a real context so the "already inside a provider" transparency check is exercised
// for real, and a passthrough `WagmiProvider` that simply publishes its `config` as the context value.
vi.mock('wagmi', async() => {
  const ReactMod = await import('react');
  const WagmiContext = ReactMod.createContext<unknown>(undefined);
  const WagmiProvider = ({ config, children }: { config: unknown; children: React.ReactNode }) =>
    ReactMod.createElement(WagmiContext.Provider, { value: config }, children);
  return { WagmiContext, WagmiProvider };
});

vi.mock('src/features/connect-wallet/utils/runtime', () => ({
  ensureLoaded: runtimeMock.ensureLoaded,
}));

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

const readyRuntime = { isReady: true, config: {} } as unknown as Web3Runtime;
const disabledRuntime = { isReady: false, config: undefined } as unknown as Web3Runtime;

describe('Web3Boundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('is transparent when a WagmiProvider already sits above it (renders children, never loads)', async() => {
    const { WagmiProvider } = await import('wagmi');
    const config = {} as React.ComponentProps<typeof WagmiProvider>['config'];

    render(
      <WagmiProvider config={ config }>
        <Web3Boundary fallback={ <div>skeleton</div> }>
          <div>feature</div>
        </Web3Boundary>
      </WagmiProvider>,
    );

    expect(screen.queryByText('feature')).not.toBeNull();
    expect(screen.queryByText('skeleton')).toBeNull();
    expect(runtimeMock.ensureLoaded).not.toHaveBeenCalled();
  });

  it('shows the fallback while loading, then the children once the runtime resolves with a config', async() => {
    const { promise, resolve } = deferred<Web3Runtime>();
    runtimeMock.ensureLoaded.mockReturnValue(promise);

    render(
      <Web3Boundary fallback={ <div>skeleton</div> }>
        <div>feature</div>
      </Web3Boundary>,
    );

    expect(screen.queryByText('skeleton')).not.toBeNull();
    expect(screen.queryByText('feature')).toBeNull();
    expect(runtimeMock.ensureLoaded).toHaveBeenCalledTimes(1);

    resolve(readyRuntime);

    expect(await screen.findByText('feature')).not.toBeNull();
    expect(screen.queryByText('skeleton')).toBeNull();
  });

  it('keeps the fallback up when the wallet chunks fail to load (disabled runtime, no config)', async() => {
    runtimeMock.ensureLoaded.mockResolvedValue(disabledRuntime);

    render(
      <Web3Boundary fallback={ <div>skeleton</div> }>
        <div>feature</div>
      </Web3Boundary>,
    );

    // let the resolved promise flush
    await Promise.resolve();

    expect(screen.queryByText('skeleton')).not.toBeNull();
    expect(screen.queryByText('feature')).toBeNull();
  });
});

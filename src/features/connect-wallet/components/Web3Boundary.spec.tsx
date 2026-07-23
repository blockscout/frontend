// @vitest-environment jsdom

import React from 'react';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';

import Web3Boundary from './Web3Boundary';

const providerMock = vi.hoisted(() => ({ isReady: false }));
const runtimeMock = vi.hoisted(() => ({
  ensureLoaded: vi.fn(),
  config: undefined as unknown,
}));

// A real context so the injected `WagmiContext` value can be read back by a probe consumer — this is how
// feature wagmi hooks pick up the config the sibling provider owns.
vi.mock('wagmi', async() => {
  const ReactMod = await import('react');
  return { WagmiContext: ReactMod.createContext<unknown>(undefined) };
});

vi.mock('../context', () => ({
  useIsWeb3Ready: () => providerMock.isReady,
}));

vi.mock('../utils/runtime', () => ({
  ensureLoaded: runtimeMock.ensureLoaded,
  getLoadedRuntime: () => (runtimeMock.config ? { config: runtimeMock.config } : undefined),
}));

describe('Web3Boundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    providerMock.isReady = false;
    runtimeMock.config = undefined;
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('is transparent when a WagmiProvider already sits above it (dynamic mode): renders children, never loads', async() => {
    // dynamic mode wraps the whole app in a root WagmiProvider and never mounts Web3Provider, so
    // useIsWeb3Ready is permanently false — the boundary must still render children, not the fallback
    providerMock.isReady = false;
    const { WagmiContext } = await import('wagmi');

    render(
      <WagmiContext.Provider value={{ id: 'root-config' } as never}>
        <Web3Boundary fallback={ <div>skeleton</div> }>
          <div>feature</div>
        </Web3Boundary>
      </WagmiContext.Provider>,
    );

    expect(screen.queryByText('feature')).not.toBeNull();
    expect(screen.queryByText('skeleton')).toBeNull();
    expect(runtimeMock.ensureLoaded).not.toHaveBeenCalled();
  });

  it('shows the fallback and kicks off the load while the runtime is not ready', () => {
    render(
      <Web3Boundary fallback={ <div>skeleton</div> }>
        <div>feature</div>
      </Web3Boundary>,
    );

    expect(screen.queryByText('skeleton')).not.toBeNull();
    expect(screen.queryByText('feature')).toBeNull();
    expect(runtimeMock.ensureLoaded).toHaveBeenCalledTimes(1);
  });

  it('renders the children once ready with a config, and publishes that config on WagmiContext', async() => {
    providerMock.isReady = true;
    runtimeMock.config = { id: 'wagmi-config' };

    const { WagmiContext } = await import('wagmi');
    const Probe = () => <div>ctx: { String((React.useContext(WagmiContext) as { id?: string })?.id) }</div>;

    render(
      <Web3Boundary fallback={ <div>skeleton</div> }>
        <Probe/>
      </Web3Boundary>,
    );

    expect(screen.queryByText('skeleton')).toBeNull();
    expect(screen.queryByText('ctx: wagmi-config')).not.toBeNull();
  });

  it('keeps the fallback up when the wallet chunks fail to load (ready never flips, no config)', () => {
    // a failed load leaves `useIsWeb3Ready` false and no loaded config
    providerMock.isReady = false;
    runtimeMock.config = undefined;

    render(
      <Web3Boundary fallback={ <div>skeleton</div> }>
        <div>feature</div>
      </Web3Boundary>,
    );

    expect(screen.queryByText('skeleton')).not.toBeNull();
    expect(screen.queryByText('feature')).toBeNull();
  });

  it('falls back to nothing when no fallback is provided', () => {
    const { container } = render(
      <Web3Boundary>
        <div>feature</div>
      </Web3Boundary>,
    );

    expect(screen.queryByText('feature')).toBeNull();
    expect(container.textContent).toBe('');
  });
});

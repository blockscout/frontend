// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AppKitNetwork } from '@reown/appkit/networks';
import type { createAppKit } from '@reown/appkit/react';
import type { Config } from 'wagmi';
import type { disconnect, signMessage, switchChain } from 'wagmi/actions';

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';

import colors from 'src/toolkit/theme/foundations/colors';
import { BODY_TYPEFACE } from 'src/toolkit/theme/foundations/typography';
import zIndex from 'src/toolkit/theme/foundations/zIndex';

// The Runtime is the lazy owner of the wallet chunks: it dynamically imports `wagmi-config` (pulling in
// wagmi + viem + the reown adapter), builds the AppKit singleton in reown mode, and exposes the imperative
// actions the header button needs before it lives under a provider (open modal, disconnect). Nothing here
// loads until `getWeb3Runtime()` / `ensureLoaded()` is called, so first paint never waits for these chunks.
//
// Hydration and reconnection are NOT done here — `<Web3Provider>` mounts a native `<WagmiProvider ssr:false>`
// around the app with the `config` this returns, and wagmi's own `<Hydrate>` restores the persisted state
// and reconnects. This module only prepares the config + AppKit and hands them over.
//
// A load failure resolves to a disabled runtime: the Bridge flips to disconnected and every action rejects
// with `Web3RuntimeUnavailableError`, matching the "wallet unavailable, page still works" goal.

type AppKit = ReturnType<typeof createAppKit>;

export class Web3RuntimeUnavailableError extends Error {
  constructor() {
    super('Wallet runtime failed to load');
    this.name = 'Web3RuntimeUnavailableError';
  }
}

export interface Web3Runtime {
  // false only when the wallet chunks failed to load — actions reject, the page keeps working
  isReady: boolean;
  // the wagmi config `<Web3Provider>` mounts its `<WagmiProvider>` with (undefined only on load failure)
  config: Config | undefined;
  // AppKit modal controls (no-op in fallback / disabled modes — no React provider required). `openModal`
  // resolves once the modal is actually open so callers can hold their loading state until then.
  openModal: () => Promise<void>;
  subscribeModalState: (cb: (isOpen: boolean) => void) => () => void;
  setThemeMode: (mode: 'light' | 'dark') => void;
  // the wagmi/actions subset the boot-time consumers call imperatively before they live under a provider
  disconnect: (parameters?: Parameters<typeof disconnect>[1]) => ReturnType<typeof disconnect>;
  signMessage: (parameters: Parameters<typeof signMessage>[1]) => ReturnType<typeof signMessage>;
  switchChain: (parameters: Parameters<typeof switchChain>[1]) => ReturnType<typeof switchChain>;
}

const feature = config.features.connectWallet;

const DISABLED_RUNTIME: Web3Runtime = {
  isReady: false,
  config: undefined,
  openModal: () => Promise.resolve(),
  subscribeModalState: () => () => {},
  setThemeMode: () => {},
  disconnect: () => Promise.reject(new Web3RuntimeUnavailableError()),
  signMessage: () => Promise.reject(new Web3RuntimeUnavailableError()),
  switchChain: () => Promise.reject(new Web3RuntimeUnavailableError()),
};

async function loadRuntime(): Promise<Web3Runtime> {
  try {
    const payload = getFeaturePayload(feature);
    const reownPayload = payload?.connectorType === 'reown' ? payload : undefined;

    const [ { 'default': wagmi }, actions ] = await Promise.all([
      import('./wagmi-config'),
      import('wagmi/actions'),
    ]);
    const wagmiConfig = wagmi.config;
    const isReownMode = Boolean(reownPayload && wagmi.adapter);

    let appKit: AppKit | undefined;
    if (isReownMode && reownPayload) {
      // The modal is optional: if its creation throws, contract reads and wallet actions still work through
      // the wagmi config — a connect click just can't open a modal, which beats failing the whole load.
      try {
        const [ { createAppKit }, { chains } ] = await Promise.all([
          import('@reown/appkit/react'),
          import('./chains'),
        ]);

        appKit = createAppKit({
          adapters: [ wagmi.adapter as NonNullable<typeof wagmi.adapter> ],
          networks: chains as [ AppKitNetwork, ...Array<AppKitNetwork> ],
          metadata: {
            name: `${ config.chain.name } explorer`,
            description: `${ config.chain.name } explorer`,
            url: config.app.baseUrl,
            icons: [ config.chain.icon['default'] ].filter(Boolean),
          },
          projectId: reownPayload.reown.projectId,
          features: {
            analytics: false,
            email: false,
            socials: [],
            onramp: false,
            swaps: false,
          },
          themeVariables: {
            '--w3m-font-family': `${ BODY_TYPEFACE }, sans-serif`,
            '--w3m-accent': colors.blue[600].value,
            '--w3m-border-radius-master': '2px',
            '--w3m-z-index': zIndex?.modal2?.value,
          },
          featuredWalletIds: reownPayload.reown.featuredWalletIds,
          allowUnsupportedChain: true,
        });

        // Wait for AppKit to register its connectors before `<WagmiProvider>` mounts and reconnects: an
        // unready AppKit lets wagmi's reconnect read a not-yet-registered connector and throw. Once ready,
        // the provider's native hydrate/reconnect flows through fully-registered connectors.
        await appKit.ready();
      } catch {}
    }

    return {
      isReady: true,
      config: wagmiConfig,
      openModal: async() => {
        await appKit?.open();
      },
      subscribeModalState: (cb) => appKit ? appKit.subscribeState((state) => cb(state.open)) : () => {},
      setThemeMode: (mode) => {
        appKit?.setThemeMode(mode);
      },
      disconnect: (parameters) => actions.disconnect(wagmiConfig, parameters),
      signMessage: (parameters) => actions.signMessage(wagmiConfig, parameters),
      switchChain: (parameters) => actions.switchChain(wagmiConfig, parameters),
    };
  } catch {
    return DISABLED_RUNTIME;
  }
}

let runtimePromise: Promise<Web3Runtime> | undefined;
let loadedRuntime: Web3Runtime | undefined;
const loadListeners = new Set<(runtime: Web3Runtime) => void>();
// The color mode can change while the AppKit modal does not yet exist, so the latest value is held here
// and applied once the modal is available — otherwise the modal would open in a stale theme.
let desiredThemeMode: 'light' | 'dark' | undefined;

/**
 * Load (once) and return the wallet runtime. Single-flight: concurrent and repeated calls share one load.
 * Never rejects — a chunk-load failure resolves to the disabled runtime.
 */
export function getWeb3Runtime(): Promise<Web3Runtime> {
  if (!runtimePromise) {
    runtimePromise = loadRuntime().then((runtime) => {
      loadedRuntime = runtime;
      if (desiredThemeMode) {
        runtime.setThemeMode(desiredThemeMode);
      }
      for (const listener of loadListeners) {
        listener(runtime);
      }
      loadListeners.clear();
      return runtime;
    });
  }
  return runtimePromise;
}

/**
 * Observe the runtime load without triggering it — `<Web3Provider>` uses this to mount the native
 * `<WagmiProvider>` whenever any caller (eager reconnect, connect click, a wallet route) starts the load.
 * Fires immediately if the runtime is already loaded. Does NOT start the load itself.
 */
export function subscribeRuntimeLoaded(cb: (runtime: Web3Runtime) => void): () => void {
  if (loadedRuntime) {
    cb(loadedRuntime);
    return () => {};
  }
  loadListeners.add(cb);
  return () => {
    loadListeners.delete(cb);
  };
}

/** Alias used by route-eager and interaction paths. Triggers the load and resolves when ready. */
export const ensureLoaded = getWeb3Runtime;

/** The already-loaded runtime, or undefined if the load has not resolved yet. */
export function getLoadedRuntime(): Web3Runtime | undefined {
  return loadedRuntime;
}

/**
 * Sync the AppKit modal's theme with the app color mode without forcing the runtime to load (that would
 * defeat the deferral just to set a theme): record the mode and only touch AppKit if already loaded; the
 * load path applies the recorded mode on resolve. No-op without an AppKit instance.
 */
export function applyThemeMode(mode: 'light' | 'dark'): void {
  desiredThemeMode = mode;
  loadedRuntime?.setThemeMode(mode);
}

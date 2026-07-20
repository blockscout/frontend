// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AppKitNetwork } from '@reown/appkit/networks';
import type { createAppKit } from '@reown/appkit/react';
import type { Config, disconnect, signMessage, switchChain } from '@wagmi/core';

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';

import colors from 'src/toolkit/theme/foundations/colors';
import { BODY_TYPEFACE } from 'src/toolkit/theme/foundations/typography';
import zIndex from 'src/toolkit/theme/foundations/zIndex';
import { SECOND } from 'src/toolkit/utils/consts';

import * as bridge from './bridge';

// The Runtime is the lazy owner of the whole wallet stack: it dynamically imports `wagmi-config` (which
// pulls in wagmi + viem + the reown adapter), builds the AppKit singleton in reown mode, hydrates the
// persisted wagmi state and triggers reconnect, and wires `watchAccount` into the Bridge. Nothing here
// loads until `getWeb3Runtime()` / `ensureLoaded()` is called (idle after first paint, eager for a
// returning user, or on a wallet interaction), so first paint never waits for these chunks.
//
// A load failure resolves to a disabled runtime: the Bridge flips to disconnected and every action
// rejects with `Web3RuntimeUnavailableError`, matching the "wallet unavailable, page still works" goal.

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
  // the wagmi config, for feature islands that mount their own `<WagmiProvider>` (step 4)
  config: Config | undefined;
  // AppKit modal controls (no-op in fallback / disabled modes — no React provider required)
  openModal: () => void;
  subscribeModalState: (cb: (isOpen: boolean) => void) => () => void;
  setThemeMode: (mode: 'light' | 'dark') => void;
  // the wagmi/core action subset the boot-time hooks need (step 3)
  disconnect: (parameters?: Parameters<typeof disconnect>[1]) => ReturnType<typeof disconnect>;
  signMessage: (parameters: Parameters<typeof signMessage>[1]) => ReturnType<typeof signMessage>;
  switchChain: (parameters: Parameters<typeof switchChain>[1]) => ReturnType<typeof switchChain>;
}

const feature = config.features.connectWallet;

// upper bound for the idle-callback deferral, so the runtime is not postponed indefinitely on busy pages
const IDLE_LOAD_TIMEOUT = 2 * SECOND;

const DISABLED_RUNTIME: Web3Runtime = {
  isReady: false,
  config: undefined,
  openModal: () => {},
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

    const [ { 'default': wagmi }, core ] = await Promise.all([
      import('./wagmi-config'),
      import('@wagmi/core'),
    ]);
    const wagmiConfig = wagmi.config;

    let appKit: AppKit | undefined;
    if (reownPayload && wagmi.adapter) {
      // AppKit failure is non-fatal (matches the old `initReown` try/catch): the modal is unavailable but
      // the wagmi config + reads keep working. A hard chunk-load failure is caught by the outer try.
      try {
        const [ { createAppKit }, { chains } ] = await Promise.all([
          import('@reown/appkit/react'),
          import('./chains'),
        ]);

        // options must stay byte-identical to the old `initReown` in ReownProvider.tsx
        appKit = createAppKit({
          adapters: [ wagmi.adapter ],
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
      } catch {}
    }

    // subscribe before reconnect so the reconnecting→connected transition is observed by the Bridge
    // (the `WALLET_CONNECT` "Connected" analytics depends on the isReconnected flag it derives from it)
    core.watchAccount(wagmiConfig, {
      onChange: (data, prevData) => bridge.applyAccountChange(data, prevData),
    });

    // rehydrate the persisted state and trigger reconnect — exactly what wagmi's `<Hydrate>` does inside
    // `<WagmiProvider>` today (config uses `ssr: true` → `skipHydration`, so this must be explicit)
    core.hydrate(wagmiConfig, { reconnectOnMount: true }).onMount();

    return {
      isReady: true,
      config: wagmiConfig,
      openModal: () => {
        appKit?.open();
      },
      subscribeModalState: (cb) => appKit ? appKit.subscribeState((state) => cb(state.open)) : () => {},
      setThemeMode: (mode) => {
        appKit?.setThemeMode(mode);
      },
      disconnect: (parameters) => core.disconnect(wagmiConfig, parameters),
      signMessage: (parameters) => core.signMessage(wagmiConfig, parameters),
      switchChain: (parameters) => core.switchChain(wagmiConfig, parameters),
    };
  } catch {
    bridge.reset();
    return DISABLED_RUNTIME;
  }
}

let runtimePromise: Promise<Web3Runtime> | undefined;

/**
 * Load (once) and return the wallet runtime. Single-flight: concurrent and repeated calls share one load;
 * callers before it is ready join the in-flight promise. Never rejects — a chunk-load failure resolves to
 * the disabled runtime.
 */
export function getWeb3Runtime(): Promise<Web3Runtime> {
  runtimePromise = runtimePromise ?? loadRuntime();
  return runtimePromise;
}

/** Alias used by route-eager and interaction paths (step 4). Triggers the load and resolves when ready. */
export const ensureLoaded = getWeb3Runtime;

/**
 * Boot-time trigger (called once by the app-root boot component in step 5). Loads eagerly for a returning
 * user (persisted connection → reconnect ASAP), otherwise defers to an idle slot after first paint.
 */
export function startWeb3Runtime(): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (bridge.hasPersistedConnection()) {
    getWeb3Runtime();
    return;
  }

  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(() => {
      getWeb3Runtime();
    }, { timeout: IDLE_LOAD_TIMEOUT });
    return;
  }

  window.setTimeout(() => {
    getWeb3Runtime();
  }, 0);
}

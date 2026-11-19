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
        // unready AppKit lets wagmi's reconnect read a not-yet-registered connector and throw.
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

// The first call loads the wallet chunks, and concurrent or later calls share that load. Never rejects: a
// failed load resolves to a runtime with `isReady: false`, whose actions reject.
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

// Does not start the load. Calls `cb` once: right away when the runtime has already loaded, otherwise when
// the load resolves.
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

export const ensureLoaded = getWeb3Runtime;

export function getLoadedRuntime(): Web3Runtime | undefined {
  return loadedRuntime;
}

// Does not start the load: the mode is kept and applied once the runtime loads.
export function applyThemeMode(mode: 'light' | 'dark'): void {
  desiredThemeMode = mode;
  loadedRuntime?.setThemeMode(mode);
}

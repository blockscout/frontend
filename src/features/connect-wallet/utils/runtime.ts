// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AppKitNetwork } from '@reown/appkit/networks';
import type { createAppKit } from '@reown/appkit/react';
import type { Config, disconnect, signMessage, switchChain } from '@wagmi/core';

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';

import colors from 'src/toolkit/theme/foundations/colors';
import { BODY_TYPEFACE } from 'src/toolkit/theme/foundations/typography';
import zIndex from 'src/toolkit/theme/foundations/zIndex';

import * as bridge from './bridge';

// The Runtime is the lazy owner of the whole wallet stack: it dynamically imports `wagmi-config` (which
// pulls in wagmi + viem + the reown adapter), builds the AppKit singleton in reown mode, hydrates the
// persisted wagmi state and triggers reconnect, and wires `watchAccount` into the Bridge. Nothing here
// loads until `getWeb3Runtime()` / `ensureLoaded()` is called (eager for a returning user with a
// persisted connection, or on a wallet interaction), so first paint never waits for these chunks.
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
  // the wagmi config, so feature islands can mount their own `<WagmiProvider>` over just their subtree
  config: Config | undefined;
  // AppKit modal controls (no-op in fallback / disabled modes — no React provider required). `openModal`
  // resolves once the modal is actually open so callers can hold their loading state until then, rather
  // than dropping it the instant `open()` is dispatched.
  openModal: () => Promise<void>;
  subscribeModalState: (cb: (isOpen: boolean) => void) => () => void;
  setThemeMode: (mode: 'light' | 'dark') => void;
  // the wagmi/core action subset the boot-time consumers need without pulling wagmi onto the critical path
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
    // Read whether a connection is persisted BEFORE anything below runs: building the wagmi config and
    // the AppKit instance mutate `wagmi.store`, so a later read can come back empty and skip the reconnect
    // for a genuinely returning user, leaving the header stuck in the reconnecting state.
    const shouldReconnect = bridge.hasPersistedConnection();

    const payload = getFeaturePayload(feature);
    const reownPayload = payload?.connectorType === 'reown' ? payload : undefined;

    const [ { 'default': wagmi }, core ] = await Promise.all([
      import('./wagmi-config'),
      import('@wagmi/core'),
    ]);
    const wagmiConfig = wagmi.config;
    const isReownMode = Boolean(reownPayload && wagmi.adapter);

    // The watcher must be in place before any reconnect so the Bridge observes the reconnecting→connected
    // transition — the `WALLET_CONNECT` "Connected" analytics depends on the isReconnected flag derived
    // from that previous status.
    core.watchAccount(wagmiConfig, {
      onChange: (data, prevData) => {
        bridge.applyAccountChange(data, prevData);
      },
    });

    let appKit: AppKit | undefined;
    if (isReownMode && reownPayload) {
      // The modal is optional: if its creation throws, contract reads and wallet actions still work through
      // the wagmi config — a connect click just can't open a modal, which beats failing the load.
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

        // Block until AppKit has registered its connectors. wagmi's reconnect fires just below; letting it
        // run while AppKit is still initialising races that setup, and AppKit's own account listener then
        // reads a not-yet-registered connector and throws (`accountData.connector.id` on an undefined
        // connector). Once AppKit is ready the reconnect transitions flow through fully-registered
        // connectors instead.
        await appKit.ready();
      } catch {}
    }

    // The config is built with `ssr: true` (`skipHydration`): persisted state is not restored and reconnect
    // is not fired automatically, and with no `<WagmiProvider>` mounted at boot nothing else does it. So the
    // runtime rehydrates and reconnects explicitly here. `onMount()` registers the EIP-6963-discovered
    // wallet extensions as connectors (without which no injected wallet is connectable) and reconnects a
    // persisted connection — wagmi owns reconnection in every mode, since AppKit's own reconnect path
    // covers WalletConnect sessions only, not injected wallets. `reconnectOnMount` is gated on a persisted
    // connection so the `connecting` spinner never flashes for a user who never connected.
    await core.hydrate(wagmiConfig, { reconnectOnMount: shouldReconnect }).onMount();

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
let loadedRuntime: Web3Runtime | undefined;
// The color mode can change while the AppKit modal does not yet exist, so the latest value is held here
// and applied once the modal is available — otherwise the modal would open in a stale theme.
let desiredThemeMode: 'light' | 'dark' | undefined;

/**
 * Load (once) and return the wallet runtime. Single-flight: concurrent and repeated calls share one load;
 * callers before it is ready join the in-flight promise. Never rejects — a chunk-load failure resolves to
 * the disabled runtime.
 */
export function getWeb3Runtime(): Promise<Web3Runtime> {
  if (!runtimePromise) {
    runtimePromise = loadRuntime().then((runtime) => {
      loadedRuntime = runtime;
      if (desiredThemeMode) {
        runtime.setThemeMode(desiredThemeMode);
      }
      return runtime;
    });
  }
  return runtimePromise;
}

/** Alias used by route-eager and interaction paths (step 4). Triggers the load and resolves when ready. */
export const ensureLoaded = getWeb3Runtime;

/**
 * Sync the AppKit modal's theme with the app color mode. Must not force the runtime to load (that would
 * defeat the deferral just to set a theme), so it records the mode and only touches AppKit if the runtime
 * is already loaded; the load path applies the recorded mode on resolve. No-op without an AppKit instance.
 */
export function applyThemeMode(mode: 'light' | 'dark'): void {
  desiredThemeMode = mode;
  loadedRuntime?.setThemeMode(mode);
}

/**
 * Boot-time trigger. Loads the runtime only for a returning user whose connection is persisted, so they
 * reconnect without an interaction. Everyone else loads it lazily on the first wallet interaction: loading
 * it at boot just to preload chunks would initialise AppKit, which drives the account through `connecting`
 * and flashes the header button's spinner for a user who never connected. Restricted to reown mode —
 * fallback/disabled loads on a contract read, and dynamic mode keeps its own provider.
 */
export function startWeb3Runtime(): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (getFeaturePayload(feature)?.connectorType === 'reown' && bridge.hasPersistedConnection()) {
    getWeb3Runtime();
  }
}

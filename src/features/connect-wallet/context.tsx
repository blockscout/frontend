// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';
import type { Config } from 'wagmi';

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';

import { useColorMode } from 'src/toolkit/chakra/color-mode';

import * as bridge from './utils/bridge';
import { applyThemeMode, ensureLoaded, subscribeRuntimeLoaded } from './utils/runtime';

// `<Web3Provider>` hosts the wallet stack for reown/fallback modes without ever wrapping the app. It mounts
// NO wallet chunk at first paint; when the runtime loads (eagerly for a returning user, or on the first
// wallet interaction / wallet route) it mounts the native `<WagmiProvider>` as a trailing SIBLING of the
// app — never an ancestor — so the app tree is never remounted and keeps all its state (an email-auth
// session survives connecting a wallet). Boot-time consumers read account state from the Bridge, not from
// wagmi context, so they need no provider above them. This module stays free of any static wagmi/viem
// import so it never pulls those chunks onto the critical path; the native provider lives in the lazily
// imported inner module. The eager reconnect is still focus-guarded (see below): the sibling mount doesn't
// remount the app, but an idle load kicked off mid-keystroke is pointless churn, so it waits for a pause.

const Web3ReadyContext = React.createContext(false);

/** True once the native `<WagmiProvider>` is mounted — wallet hooks may be used only where this is true. */
export function useIsWeb3Ready(): boolean {
  return React.useContext(Web3ReadyContext);
}

type Web3ProviderInnerComponent = React.ComponentType<{
  config: Config;
  reconnectOnMount: boolean;
}>;

const feature = config.features.connectWallet;
const isReownMode = getFeaturePayload(feature)?.connectorType === 'reown';

function isTypingInto(element: Element | null): boolean {
  return element instanceof HTMLElement &&
    (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.isContentEditable);
}

interface Props {
  children: React.ReactNode;
}

export const Web3Provider = ({ children }: Props) => {
  const { colorMode } = useColorMode();
  const [ loaded, setLoaded ] = React.useState<{ Inner?: Web3ProviderInnerComponent; config: Config } | undefined>();

  // Keep the AppKit modal theme in sync with the app color mode. No-op until the runtime loads (and never
  // forces it to load), so this stays off the critical path — replaces the old Web3Boot effect.
  React.useEffect(() => {
    applyThemeMode(colorMode ?? 'light');
  }, [ colorMode ]);

  // Observe the runtime load — started by the eager reconnect below, a connect click, or a wallet route.
  // Once it resolves with a config, pull the inner provider module and mount it in a single state update,
  // so the subtree remounts exactly once. A failed load leaves us provider-less with the Bridge reset.
  React.useEffect(() => {
    let isActive = true;
    const unsubscribe = subscribeRuntimeLoaded((runtime) => {
      if (!runtime.config) {
        bridge.reset();
        return;
      }
      const runtimeConfig = runtime.config;
      import('./components/Web3ProviderInner').then((module) => {
        if (isActive) {
          setLoaded({ Inner: module.default, config: runtimeConfig });
        }
      }).catch(() => {
        // The provider chunk failed *after* the runtime already loaded (rare — its wagmi import is a chunk
        // the runtime pulled too). Degrade rather than strand the islands on their skeletons forever: flip
        // ready with the config but no sibling, so `Web3Boundary` islands still render and read through the
        // public client, and reset the header account so it drops the optimistic seed instead of spinning.
        if (isActive) {
          bridge.reset();
          setLoaded({ config: runtimeConfig });
        }
      });
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  // Returning user (reown only): reconnect without an interaction. Deferred to idle and skipped while an
  // input is focused — the provider mount remounts the tree, which would wipe in-progress typing; retry on
  // a later idle tick instead. New users load the runtime on their first connect click, so no eager load.
  React.useEffect(() => {
    if (!isReownMode || !bridge.hasPersistedConnection()) {
      return;
    }

    let isCancelled = false;
    let handle: number | undefined;

    const schedule = () => {
      handle = typeof window.requestIdleCallback === 'function' ?
        window.requestIdleCallback(attempt) :
        window.setTimeout(attempt, 200);
    };

    function attempt() {
      if (isCancelled) {
        return;
      }
      if (isTypingInto(document.activeElement)) {
        schedule();
        return;
      }
      ensureLoaded();
    }

    schedule();

    return () => {
      isCancelled = true;
      if (handle === undefined) {
        return;
      }
      if (typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(handle);
      } else {
        window.clearTimeout(handle);
      }
    };
  }, []);

  const Inner = loaded?.Inner;

  // The app (`children`) is never wrapped by the wagmi provider — the provider mounts as a trailing SIBLING
  // that hosts only `AccountPublisher`. Adding a trailing sibling doesn't remount the earlier ones, and
  // flipping the ready-context value re-renders consumers without remounting them, so mounting the wallet
  // stack leaves all app state intact (e.g. an email-authenticated session survives connecting a wallet).
  // Route features that need wagmi hooks get their own context from `<Web3Boundary>` islands instead.
  return (
    <Web3ReadyContext.Provider value={ Boolean(loaded) }>
      { children }
      { loaded && Inner ? <Inner config={ loaded.config } reconnectOnMount={ bridge.hasPersistedConnection() }/> : null }
    </Web3ReadyContext.Provider>
  );
};

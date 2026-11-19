// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';
import type { Config } from 'wagmi';

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';

import { useColorMode } from 'src/toolkit/chakra/color-mode';

import * as bridge from './utils/bridge';
import { applyThemeMode, ensureLoaded, subscribeRuntimeLoaded } from './utils/runtime';

const Web3ReadyContext = React.createContext(false);

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
        // Ready without the sibling, so the `Web3Boundary` islands do not stay on their fallback forever. The
        // Bridge reset makes the header drop the optimistic address instead of spinning.
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

  // A returning user (reown only) reconnects without an interaction. The load waits for an idle tick with no
  // input focused, so it does not land mid-keystroke.
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

  // Beside `children`, not around them: a wrapper mounted on load would remount the app and lose its state,
  // such as an email-authenticated session. Reconnecting on mount only with a persisted connection spares a
  // new user the reconnect spinner.
  return (
    <Web3ReadyContext.Provider value={ Boolean(loaded) }>
      { children }
      { loaded && Inner ? <Inner config={ loaded.config } reconnectOnMount={ bridge.hasPersistedConnection() }/> : null }
    </Web3ReadyContext.Provider>
  );
};

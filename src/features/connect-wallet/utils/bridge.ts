// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

// The Bridge is a tiny, permanently-mounted external store that provides wallet **account state** to
// boot-time consumers (header button, ad banner, ENS lookup) without any of them importing the
// wagmi/appkit chunks. It is seeded *optimistically* from wagmi's persisted `localStorage` state so a
// returning user sees their address immediately (no "Connect" flash), then corrected by the Runtime's
// `watchAccount` once the wallet chunks load. It never swaps a provider element, so nothing remounts.
//
// This module must stay free of any static wagmi/viem/appkit import — it runs on the critical path.
// The persisted state is therefore parsed by hand rather than through wagmi's `deserialize`.

export type Web3AccountStatus =
  | 'disconnected' |
  'optimistic' | // persisted address shown before the runtime confirms it (reconnecting-style)
  'connecting' |
  'connected' |
  'reconnecting';

export interface Web3Account {
  address: string | undefined;
  status: Web3AccountStatus;
}

// The status the Runtime feeds in from wagmi's `getAccount`/`watchAccount` — a subset of
// `Web3AccountStatus` (never `optimistic`), with `undefined` possible for `prevData` on first change.
export interface WagmiAccountSnapshot {
  address?: string;
  status: 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | undefined;
}

export interface ConnectionHandlers {
  // fired when an account transitions to connected; `isReconnected` distinguishes auto-reconnect from a
  // fresh user connection (mirrors wagmi's `useAccountEffect`), for the `WALLET_CONNECT` analytics
  onConnect?: (payload: { address: string | undefined; isReconnected: boolean }) => void;
  onDisconnect?: () => void;
}

// wagmi persists under this key (`createStorage` prefix `wagmi` + persist name `store`). `version` is the
// `@wagmi/core` major (2.x → 2); a mismatch means the schema may differ, so we fall back to disconnected.
// Comment pact: keep in sync with `@wagmi/core`'s persist `partialize` (createConfig.ts) — the Bridge
// unit tests pin the exact shape asserted here.
const WAGMI_STORE_KEY = 'wagmi.store';
const WAGMI_STORE_VERSION = 2;

// The persisted shape we read (a subset of `@wagmi/core`'s persist output). Everything is optional — the
// value is untrusted, so the reader guards each hop and falls back to disconnected on any mismatch.
interface PersistedConnection {
  accounts?: ReadonlyArray<string>;
}
interface PersistedWagmiStore {
  version?: number;
  state?: {
    current?: string | null;
    connections?: { value?: Array<[ string, PersistedConnection ]> };
  };
}

const DISCONNECTED: Web3Account = Object.freeze({ address: undefined, status: 'disconnected' });

/**
 * Read the optimistic account synchronously from persisted wagmi state. Resilient by design: bad JSON,
 * missing keys, an unexpected shape, or a version mismatch all resolve to `disconnected` rather than
 * throwing — a wrong optimistic guess is worse than none.
 */
export function readOptimisticAccount(): Web3Account {
  try {
    if (typeof window === 'undefined') {
      return DISCONNECTED;
    }

    const raw = window.localStorage.getItem(WAGMI_STORE_KEY);
    if (!raw) {
      return DISCONNECTED;
    }

    const parsed = JSON.parse(raw) as PersistedWagmiStore | null;
    if (!parsed || parsed.version !== WAGMI_STORE_VERSION) {
      return DISCONNECTED;
    }

    const current = parsed.state?.current;
    const entries = parsed.state?.connections?.value;
    if (!current || !Array.isArray(entries)) {
      return DISCONNECTED;
    }

    const connection = entries.find((entry) => Array.isArray(entry) && entry[0] === current)?.[1];
    const address = connection?.accounts?.[0];
    if (typeof address !== 'string' || !address) {
      return DISCONNECTED;
    }

    return { address, status: 'optimistic' };
  } catch {
    return DISCONNECTED;
  }
}

let account: Web3Account = readOptimisticAccount();
const listeners = new Set<() => void>();
const connectionHandlers = new Set<ConnectionHandlers>();

function setAccount(next: Web3Account) {
  if (next.address === account.address && next.status === account.status) {
    return;
  }
  account = next;
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Web3Account {
  return account;
}

// Nothing is connected on the server; the root hydration gate (step 5) keeps this from mismatching.
function getServerSnapshot(): Web3Account {
  return DISCONNECTED;
}

/** Account state for boot-time consumers. Re-renders when the Runtime updates the store. */
export function useWeb3Account(): Web3Account {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Snapshot outside React (e.g. for the Runtime's eager-load decision). */
export function getWeb3Account(): Web3Account {
  return account;
}

/** True when persisted state holds a connection — used by the Runtime to load eagerly for reconnect. */
export function hasPersistedConnection(): boolean {
  return readOptimisticAccount().status === 'optimistic';
}

/**
 * Push a confirmed wagmi account change into the store. Called by the Runtime's `watchAccount`. Passing
 * `prevData` lets the Bridge emit connect/disconnect events with the reconnect flag; the store update
 * itself needs only `data`.
 */
export function applyAccountChange(data: WagmiAccountSnapshot, prevData?: WagmiAccountSnapshot) {
  const rawStatus = data.status ?? 'disconnected';

  // Restoring a persisted connection runs through wagmi's `connecting` status, which drops the address and
  // would flash the "Connect" button between the optimistic seed and the confirmed connection. While the
  // store is still mid-reconnect, present that interim as `reconnecting` and hold the last known address,
  // so the header keeps the address in the reconnecting style the whole way through. A fresh user connect
  // starts from `disconnected`, so its `connecting` passes through untouched (spinner, no stale address).
  const isMidReconnect = account.status === 'optimistic' || account.status === 'reconnecting';
  const nextStatus: Web3AccountStatus = rawStatus === 'connecting' && isMidReconnect ? 'reconnecting' : rawStatus;
  const nextAddress = data.address ?? (nextStatus === 'reconnecting' ? account.address : undefined);

  setAccount({ address: nextAddress, status: nextStatus });

  if (!prevData) {
    return;
  }

  const becameConnected =
    (prevData.status === 'reconnecting' || (prevData.status === 'connecting' && prevData.address === undefined)) &&
    data.status === 'connected';

  if (becameConnected) {
    const isReconnected = prevData.status === 'reconnecting' || prevData.status === undefined;
    for (const handlers of connectionHandlers) {
      handlers.onConnect?.({ address: data.address, isReconnected });
    }
  } else if (prevData.status === 'connected' && data.status === 'disconnected') {
    for (const handlers of connectionHandlers) {
      handlers.onDisconnect?.();
    }
  }
}

/** Flip the store to disconnected — used when the wallet runtime fails to load. */
export function reset() {
  setAccount({ ...DISCONNECTED });
}

/** Subscribe to connect/disconnect events (for `WALLET_CONNECT` analytics in the wallet hooks). */
export function subscribeConnection(handlers: ConnectionHandlers): () => void {
  connectionHandlers.add(handlers);
  return () => {
    connectionHandlers.delete(handlers);
  };
}

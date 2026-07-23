// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

// The Bridge is a tiny, permanently-mounted external store that hands wallet **account state** to
// boot-time consumers (header button, ad banner, ENS lookup) that render before the wallet chunks load —
// i.e. before any `<WagmiProvider>` exists, where calling wagmi's own hooks would throw. It carries no
// wallet logic of its own: once the provider mounts, `AccountPublisher` mirrors wagmi's native
// `useAccount` into this store, and that is the only writer. Reconnection, hydration and status
// transitions are wagmi's job now — this file must not reimplement any of them.
//
// It stays free of any static wagmi/viem/appkit import, so it never pulls those chunks onto the critical
// path. The one piece of persisted state it reads is an **own-format** flag (below), written by us on
// connect/disconnect — never wagmi's internal `wagmi.store`, so a wagmi/reown upgrade can't break it.

export type Web3AccountStatus =
  | 'disconnected' |
  'reconnecting' | // persisted address shown before wagmi confirms it (covers the optimistic window too)
  'connecting' |
  'connected';

export interface Web3Account {
  address: string | undefined;
  status: Web3AccountStatus;
}

export interface ConnectionHandlers {
  // fired when an account transitions to connected; `isReconnected` distinguishes auto-reconnect from a
  // fresh user connection (comes straight from wagmi's `useAccountEffect`), for the `WALLET_CONNECT` event
  onConnect?: (payload: { address: string | undefined; isReconnected: boolean }) => void;
  onDisconnect?: () => void;
}

// Our own persisted flag — a value WE write, so its shape is ours to keep stable across wagmi upgrades.
// Holds just the last connected address, which is all the optimistic header display needs.
const WALLET_FLAG_KEY = 'bs:wallet';

interface WalletFlag {
  address?: string;
}

const DISCONNECTED: Web3Account = Object.freeze({ address: undefined, status: 'disconnected' });

/** Read the own-format flag. Resilient: anything that fails to parse resolves to "no persisted connection". */
function readWalletFlag(): WalletFlag | undefined {
  try {
    if (typeof window === 'undefined') {
      return undefined;
    }
    const raw = window.localStorage.getItem(WALLET_FLAG_KEY);
    if (!raw) {
      return undefined;
    }
    const parsed = JSON.parse(raw) as WalletFlag | null;
    return parsed && typeof parsed.address === 'string' && parsed.address ? parsed : undefined;
  } catch {
    return undefined;
  }
}

/** Persist the own-format flag on a confirmed connection (called by `AccountPublisher` on connect). */
export function setWalletFlag(address: string): void {
  try {
    window.localStorage.setItem(WALLET_FLAG_KEY, JSON.stringify({ address } satisfies WalletFlag));
  } catch {}
}

/** Clear the own-format flag on disconnect / failed reconnect. */
export function clearWalletFlag(): void {
  try {
    window.localStorage.removeItem(WALLET_FLAG_KEY);
  } catch {}
}

/** True when the own flag holds a connection — used to decide the eager reconnect load + optimistic UI. */
export function hasPersistedConnection(): boolean {
  return Boolean(readWalletFlag());
}

// One-time migration onto the own-format flag. Before this module existed the app relied on wagmi's own
// `wagmi.store` for the connection; a user who last connected then has `wagmi.store` but no `bs:wallet`,
// so without this they would lose the optimistic seed and eager reconnect until they connect again. Read
// `wagmi.store` exactly once at init and, if it holds a current connection, seed our flag from it — wagmi
// still owns the real reconnection. This is the only place that touches wagmi's internal storage; it is
// safe to delete a release cycle after users have re-persisted via `bs:wallet`.
const LEGACY_WAGMI_STORE_KEY = 'wagmi.store';

function migrateLegacyWalletFlag(): void {
  try {
    if (typeof window === 'undefined' || readWalletFlag()) {
      return;
    }
    const raw = window.localStorage.getItem(LEGACY_WAGMI_STORE_KEY);
    if (!raw) {
      return;
    }
    // wagmi persists `{ state: { connections: {__type:'Map', value:[[uid,{accounts,…}],…]}, current }, version }`
    // where `version` is @wagmi/core's major. Guard every step so a shape change just skips the migration.
    const parsed = JSON.parse(raw) as {
      version?: number;
      state?: { current?: string; connections?: { __type?: string; value?: Array<[ string, { accounts?: Array<string> } ]> } };
    } | null;
    if (!parsed || parsed.version !== 2 || parsed.state?.connections?.__type !== 'Map') {
      return;
    }
    const { current, connections } = parsed.state;
    const address = current ? connections.value?.find(([ uid ]) => uid === current)?.[1]?.accounts?.[0] : undefined;
    if (typeof address === 'string' && address) {
      setWalletFlag(address);
    }
  } catch {}
}

// Seed optimistically from the own flag: a returning user sees their persisted address in the reconnecting
// style immediately, with no "Connect" flash, before the provider confirms it.
function readOptimisticAccount(): Web3Account {
  const flag = readWalletFlag();
  return flag ? { address: flag.address, status: 'reconnecting' } : DISCONNECTED;
}

migrateLegacyWalletFlag();

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

// Nothing is connected on the server; the root hydration gate keeps this from mismatching.
function getServerSnapshot(): Web3Account {
  return DISCONNECTED;
}

/** Account state for boot-time consumers. Re-renders when `AccountPublisher` updates the store. */
export function useWeb3Account(): Web3Account {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Snapshot outside React. */
export function getWeb3Account(): Web3Account {
  return account;
}

/**
 * Mirror wagmi's confirmed account status into the store. Called only by `AccountPublisher` (which reads
 * wagmi's native `useAccount`), so the status values are wagmi's own — no reinterpretation here.
 */
export function setWeb3Account(next: Web3Account): void {
  setAccount(next);
}

/** Flip to disconnected — used when the wallet runtime fails to load. */
export function reset() {
  setAccount({ ...DISCONNECTED });
}

/** Emit a connect/disconnect event to subscribers (for `WALLET_CONNECT` analytics in the wallet hooks). */
export function emitConnectionChange(
  event: { type: 'connect'; address: string | undefined; isReconnected: boolean } | { type: 'disconnect' },
): void {
  for (const handlers of connectionHandlers) {
    if (event.type === 'connect') {
      handlers.onConnect?.({ address: event.address, isReconnected: event.isReconnected });
    } else {
      handlers.onDisconnect?.();
    }
  }
}

/** Subscribe to connect/disconnect events (for `WALLET_CONNECT` analytics in the wallet hooks). */
export function subscribeConnection(handlers: ConnectionHandlers): () => void {
  connectionHandlers.add(handlers);
  return () => {
    connectionHandlers.delete(handlers);
  };
}

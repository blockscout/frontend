// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

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

export function setWalletFlag(address: string): void {
  try {
    window.localStorage.setItem(WALLET_FLAG_KEY, JSON.stringify({ address } satisfies WalletFlag));
  } catch {}
}

export function clearWalletFlag(): void {
  try {
    window.localStorage.removeItem(WALLET_FLAG_KEY);
  } catch {}
}

export function hasPersistedConnection(): boolean {
  return Boolean(readWalletFlag());
}

const LEGACY_WAGMI_STORE_KEY = 'wagmi.store';

// A user who last connected before the own flag existed keeps the optimistic address and the eager
// reconnect only through this. Safe to delete once those users have aged out.
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

export function useWeb3Account(): Web3Account {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function getWeb3Account(): Web3Account {
  return account;
}

export function setWeb3Account(next: Web3Account): void {
  setAccount(next);
}

export function reset() {
  setAccount({ ...DISCONNECTED });
}

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

export function subscribeConnection(handlers: ConnectionHandlers): () => void {
  connectionHandlers.add(handlers);
  return () => {
    connectionHandlers.delete(handlers);
  };
}

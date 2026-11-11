// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from 'vitest/lib';

// `account`, listeners and connection handlers are module-scope state, and the store is seeded from the
// persisted flag at import time — so every test imports a fresh copy after seeding localStorage.
async function importBridge() {
  return import('./bridge');
}

const WALLET_FLAG_KEY = 'bs:wallet';
const LEGACY_WAGMI_STORE_KEY = 'wagmi.store';

// Builds a `wagmi.store` value matching @wagmi/core's persisted shape, for the one-time migration.
function legacyWagmiStore(
  { address = '0xabc', current = 'uid-1', version = 2 }: { address?: string | null; current?: string | null; version?: number } = {},
) {
  return JSON.stringify({
    version,
    state: {
      chainId: 1,
      current,
      connections: {
        __type: 'Map',
        value: [ [ 'uid-1', { accounts: address ? [ address ] : [], chainId: 1, connector: { id: 'io.metamask' } } ] ],
      },
    },
  });
}

describe('connect-wallet bridge', () => {
  beforeEach(() => {
    vi.resetModules();
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  describe('one-time migration from wagmi.store', () => {
    it('seeds bs:wallet from a legacy wagmi.store connection when our flag is absent', async() => {
      window.localStorage.setItem(LEGACY_WAGMI_STORE_KEY, legacyWagmiStore({ address: '0xdead' }));
      const { getWeb3Account, hasPersistedConnection } = await importBridge();
      expect(window.localStorage.getItem(WALLET_FLAG_KEY)).toBe(JSON.stringify({ address: '0xdead' }));
      expect(getWeb3Account()).toEqual({ address: '0xdead', status: 'reconnecting' });
      expect(hasPersistedConnection()).toBe(true);
    });

    it('does not overwrite an existing bs:wallet flag', async() => {
      window.localStorage.setItem(WALLET_FLAG_KEY, JSON.stringify({ address: '0xabc' }));
      window.localStorage.setItem(LEGACY_WAGMI_STORE_KEY, legacyWagmiStore({ address: '0xdead' }));
      const { getWeb3Account } = await importBridge();
      expect(getWeb3Account()).toEqual({ address: '0xabc', status: 'reconnecting' });
    });

    it('skips a malformed / version-mismatched / connection-less legacy store', async() => {
      for (const value of [
        '{not json',
        legacyWagmiStore({ version: 1 }),
        legacyWagmiStore({ current: null }),
        legacyWagmiStore({ current: 'uid-missing' }),
        legacyWagmiStore({ address: null }),
      ]) {
        vi.resetModules();
        window.localStorage.clear();
        window.localStorage.setItem(LEGACY_WAGMI_STORE_KEY, value);
        const { hasPersistedConnection } = await importBridge();
        expect(hasPersistedConnection()).toBe(false);
        expect(window.localStorage.getItem(WALLET_FLAG_KEY)).toBeNull();
      }
    });
  });

  describe('persisted own-format flag', () => {
    it('seeds the store optimistically (reconnecting) from a persisted address', async() => {
      window.localStorage.setItem(WALLET_FLAG_KEY, JSON.stringify({ address: '0xdead' }));
      const { getWeb3Account, hasPersistedConnection } = await importBridge();
      expect(getWeb3Account()).toEqual({ address: '0xdead', status: 'reconnecting' });
      expect(hasPersistedConnection()).toBe(true);
    });

    it('starts disconnected when nothing is persisted', async() => {
      const { getWeb3Account, hasPersistedConnection } = await importBridge();
      expect(getWeb3Account()).toEqual({ address: undefined, status: 'disconnected' });
      expect(hasPersistedConnection()).toBe(false);
    });

    it('ignores a malformed flag', async() => {
      window.localStorage.setItem(WALLET_FLAG_KEY, '{not json');
      const { getWeb3Account, hasPersistedConnection } = await importBridge();
      expect(getWeb3Account().status).toBe('disconnected');
      expect(hasPersistedConnection()).toBe(false);
    });

    it('ignores a flag with no usable address', async() => {
      window.localStorage.setItem(WALLET_FLAG_KEY, JSON.stringify({ address: '' }));
      const { hasPersistedConnection } = await importBridge();
      expect(hasPersistedConnection()).toBe(false);
    });

    it('setWalletFlag persists an address that a later import reads back', async() => {
      const bridge = await importBridge();
      bridge.setWalletFlag('0xabc');
      expect(window.localStorage.getItem(WALLET_FLAG_KEY)).toBe(JSON.stringify({ address: '0xabc' }));

      vi.resetModules();
      const reimported = await importBridge();
      expect(reimported.getWeb3Account()).toEqual({ address: '0xabc', status: 'reconnecting' });
    });

    it('clearWalletFlag removes the persisted flag', async() => {
      window.localStorage.setItem(WALLET_FLAG_KEY, JSON.stringify({ address: '0xabc' }));
      const bridge = await importBridge();
      bridge.clearWalletFlag();
      expect(window.localStorage.getItem(WALLET_FLAG_KEY)).toBeNull();
      expect(bridge.hasPersistedConnection()).toBe(false);
    });
  });

  describe('setWeb3Account', () => {
    it('mirrors the confirmed wagmi account into the store verbatim', async() => {
      const bridge = await importBridge();
      bridge.setWeb3Account({ address: '0x1', status: 'connected' });
      expect(bridge.getWeb3Account()).toEqual({ address: '0x1', status: 'connected' });
    });

    it('keeps the same snapshot when an identical update arrives (no needless re-render)', async() => {
      const bridge = await importBridge();
      const { result } = renderHook(() => bridge.useWeb3Account());
      expect(result.current.status).toBe('disconnected');

      act(() => {
        bridge.setWeb3Account({ address: '0x1', status: 'connected' });
      });
      expect(result.current).toEqual({ address: '0x1', status: 'connected' });

      // an identical update must not swap the snapshot reference — useSyncExternalStore would otherwise
      // re-render every boot consumer on each no-op mirror from AccountPublisher
      const before = result.current;
      act(() => {
        bridge.setWeb3Account({ address: '0x1', status: 'connected' });
      });
      expect(result.current).toBe(before);
    });
  });

  describe('reset', () => {
    it('flips the store to disconnected', async() => {
      window.localStorage.setItem(WALLET_FLAG_KEY, JSON.stringify({ address: '0xabc' }));
      const bridge = await importBridge();
      expect(bridge.getWeb3Account().status).toBe('reconnecting');
      bridge.reset();
      expect(bridge.getWeb3Account()).toEqual({ address: undefined, status: 'disconnected' });
    });
  });

  describe('connection events', () => {
    it('forwards a connect event to subscribers', async() => {
      const bridge = await importBridge();
      const onConnect = vi.fn();
      bridge.subscribeConnection({ onConnect });
      bridge.emitConnectionChange({ type: 'connect', address: '0x1', isReconnected: false });
      expect(onConnect).toHaveBeenCalledWith({ address: '0x1', isReconnected: false });
    });

    it('forwards a disconnect event to subscribers', async() => {
      const bridge = await importBridge();
      const onDisconnect = vi.fn();
      bridge.subscribeConnection({ onDisconnect });
      bridge.emitConnectionChange({ type: 'disconnect' });
      expect(onDisconnect).toHaveBeenCalledTimes(1);
    });

    it('notifies every current subscriber', async() => {
      const bridge = await importBridge();
      const first = vi.fn();
      const second = vi.fn();
      bridge.subscribeConnection({ onConnect: first });
      bridge.subscribeConnection({ onConnect: second });
      bridge.emitConnectionChange({ type: 'connect', address: '0x1', isReconnected: true });
      expect(first).toHaveBeenCalledWith({ address: '0x1', isReconnected: true });
      expect(second).toHaveBeenCalledWith({ address: '0x1', isReconnected: true });
    });

    it('stops notifying after unsubscribe', async() => {
      const bridge = await importBridge();
      const onConnect = vi.fn();
      const unsubscribe = bridge.subscribeConnection({ onConnect });
      unsubscribe();
      bridge.emitConnectionChange({ type: 'connect', address: '0x1', isReconnected: false });
      expect(onConnect).not.toHaveBeenCalled();
    });
  });

  describe('useWeb3Account', () => {
    it('returns the current snapshot and re-renders on change', async() => {
      window.localStorage.setItem(WALLET_FLAG_KEY, JSON.stringify({ address: '0xabc' }));
      const bridge = await importBridge();
      const { result } = renderHook(() => bridge.useWeb3Account());
      expect(result.current).toEqual({ address: '0xabc', status: 'reconnecting' });

      act(() => {
        bridge.setWeb3Account({ address: '0xabc', status: 'connected' });
      });
      expect(result.current).toEqual({ address: '0xabc', status: 'connected' });
    });
  });
});

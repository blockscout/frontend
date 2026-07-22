// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from 'vitest/lib';

// `account`, listeners and connection handlers are module-scope state, so every test imports a fresh copy
// after seeding localStorage.
async function importBridge() {
  return import('./bridge');
}

interface StoreOverrides {
  address?: string | null;
  current?: string | null;
  version?: number;
}

// Builds a `wagmi.store` value matching @wagmi/core's persist output (see bridge.ts comment pact).
function persistedStore({ address = '0xabc', current = 'uid-1', version = 2 }: StoreOverrides = {}) {
  return JSON.stringify({
    version,
    state: {
      chainId: 1,
      current,
      connections: {
        __type: 'Map',
        value: [
          [
            'uid-1',
            {
              accounts: address ? [ address ] : [],
              chainId: 1,
              connector: { id: 'io.metamask', name: 'MetaMask', type: 'injected', uid: 'uid-1' },
            },
          ],
        ],
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

  describe('optimistic account (readOptimisticAccount)', () => {
    it('reads the persisted current connection as an optimistic address', async() => {
      window.localStorage.setItem('wagmi.store', persistedStore({ address: '0xdead' }));
      const { readOptimisticAccount, getWeb3Account } = await importBridge();
      expect(readOptimisticAccount()).toEqual({ address: '0xdead', status: 'optimistic' });
      // the module store is seeded from it at import time
      expect(getWeb3Account()).toEqual({ address: '0xdead', status: 'optimistic' });
    });

    it('is disconnected when nothing is persisted', async() => {
      const { readOptimisticAccount } = await importBridge();
      expect(readOptimisticAccount()).toEqual({ address: undefined, status: 'disconnected' });
    });

    it('is disconnected on malformed JSON', async() => {
      window.localStorage.setItem('wagmi.store', '{not json');
      const { readOptimisticAccount } = await importBridge();
      expect(readOptimisticAccount().status).toBe('disconnected');
    });

    it('is disconnected on a version mismatch', async() => {
      window.localStorage.setItem('wagmi.store', persistedStore({ version: 1 }));
      const { readOptimisticAccount } = await importBridge();
      expect(readOptimisticAccount().status).toBe('disconnected');
    });

    it('is disconnected when there is no current connection', async() => {
      window.localStorage.setItem('wagmi.store', persistedStore({ current: null }));
      const { readOptimisticAccount } = await importBridge();
      expect(readOptimisticAccount().status).toBe('disconnected');
    });

    it('is disconnected when the current uid has no matching connection', async() => {
      window.localStorage.setItem('wagmi.store', persistedStore({ current: 'uid-missing' }));
      const { readOptimisticAccount } = await importBridge();
      expect(readOptimisticAccount().status).toBe('disconnected');
    });

    it('is disconnected when the connection has no account', async() => {
      window.localStorage.setItem('wagmi.store', persistedStore({ address: null }));
      const { readOptimisticAccount } = await importBridge();
      expect(readOptimisticAccount().status).toBe('disconnected');
    });

    it('reports hasPersistedConnection accordingly', async() => {
      window.localStorage.setItem('wagmi.store', persistedStore({ address: '0xabc' }));
      const connected = await importBridge();
      expect(connected.hasPersistedConnection()).toBe(true);

      vi.resetModules();
      window.localStorage.clear();
      const disconnected = await importBridge();
      expect(disconnected.hasPersistedConnection()).toBe(false);
    });
  });

  describe('applyAccountChange', () => {
    it('updates the store from the confirmed wagmi account', async() => {
      const bridge = await importBridge();
      bridge.applyAccountChange({ address: '0x1', status: 'connected' }, { status: 'connecting', address: undefined });
      expect(bridge.getWeb3Account()).toEqual({ address: '0x1', status: 'connected' });
    });

    it('maps an undefined wagmi status to disconnected', async() => {
      const bridge = await importBridge();
      bridge.applyAccountChange({ address: undefined, status: undefined });
      expect(bridge.getWeb3Account()).toEqual({ address: undefined, status: 'disconnected' });
    });

    it('holds the optimistic address in the reconnecting style through the interim connecting phase', async() => {
      window.localStorage.setItem('wagmi.store', persistedStore({ address: '0xabc' }));
      const bridge = await importBridge();
      // restoring a persisted connection surfaces as `connecting` with no address yet — the header must not
      // flash "Connect", so the seeded address is held and the status presented as `reconnecting`
      bridge.applyAccountChange({ address: undefined, status: 'connecting' }, { status: 'reconnecting', address: undefined });
      expect(bridge.getWeb3Account()).toEqual({ address: '0xabc', status: 'reconnecting' });
    });

    it('leaves a fresh connect as connecting with no stale address', async() => {
      const bridge = await importBridge(); // nothing persisted → starts disconnected
      bridge.applyAccountChange({ address: undefined, status: 'connecting' }, { status: 'disconnected', address: undefined });
      expect(bridge.getWeb3Account()).toEqual({ address: undefined, status: 'connecting' });
    });

    it('fires onConnect with isReconnected=false for a fresh connection', async() => {
      const bridge = await importBridge();
      const onConnect = vi.fn();
      bridge.subscribeConnection({ onConnect });
      bridge.applyAccountChange({ address: '0x1', status: 'connected' }, { status: 'connecting', address: undefined });
      expect(onConnect).toHaveBeenCalledWith({ address: '0x1', isReconnected: false });
    });

    it('fires onConnect with isReconnected=true for an auto-reconnect', async() => {
      const bridge = await importBridge();
      const onConnect = vi.fn();
      bridge.subscribeConnection({ onConnect });
      bridge.applyAccountChange({ address: '0x1', status: 'connected' }, { status: 'reconnecting', address: undefined });
      expect(onConnect).toHaveBeenCalledWith({ address: '0x1', isReconnected: true });
    });

    it('does not fire onConnect when prev status is undefined (matches wagmi useAccountEffect gate)', async() => {
      // wagmi's onConnect gate only admits prev `reconnecting`/`connecting`; the `prev === undefined`
      // branch of its isReconnected computation is unreachable. The Bridge mirrors that exactly.
      const bridge = await importBridge();
      const onConnect = vi.fn();
      bridge.subscribeConnection({ onConnect });
      bridge.applyAccountChange({ address: '0x1', status: 'connected' }, { status: undefined, address: undefined });
      expect(onConnect).not.toHaveBeenCalled();
    });

    it('fires onDisconnect on a connected → disconnected transition', async() => {
      const bridge = await importBridge();
      const onDisconnect = vi.fn();
      bridge.subscribeConnection({ onDisconnect });
      bridge.applyAccountChange({ address: undefined, status: 'disconnected' }, { status: 'connected', address: '0x1' });
      expect(onDisconnect).toHaveBeenCalledTimes(1);
    });

    it('does not fire connection events for unrelated transitions', async() => {
      const bridge = await importBridge();
      const onConnect = vi.fn();
      const onDisconnect = vi.fn();
      bridge.subscribeConnection({ onConnect, onDisconnect });
      bridge.applyAccountChange({ address: undefined, status: 'reconnecting' }, { status: 'disconnected', address: undefined });
      expect(onConnect).not.toHaveBeenCalled();
      expect(onDisconnect).not.toHaveBeenCalled();
    });

    it('stops notifying after unsubscribe', async() => {
      const bridge = await importBridge();
      const onConnect = vi.fn();
      const unsubscribe = bridge.subscribeConnection({ onConnect });
      unsubscribe();
      bridge.applyAccountChange({ address: '0x1', status: 'connected' }, { status: 'reconnecting', address: undefined });
      expect(onConnect).not.toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('flips the store to disconnected', async() => {
      window.localStorage.setItem('wagmi.store', persistedStore({ address: '0xabc' }));
      const bridge = await importBridge();
      expect(bridge.getWeb3Account().status).toBe('optimistic');
      bridge.reset();
      expect(bridge.getWeb3Account()).toEqual({ address: undefined, status: 'disconnected' });
    });
  });

  describe('useWeb3Account', () => {
    it('returns the current snapshot and re-renders on change', async() => {
      window.localStorage.setItem('wagmi.store', persistedStore({ address: '0xabc' }));
      const bridge = await importBridge();
      const { result } = renderHook(() => bridge.useWeb3Account());
      expect(result.current).toEqual({ address: '0xabc', status: 'optimistic' });

      act(() => {
        bridge.applyAccountChange({ address: '0xabc', status: 'connected' }, { status: 'reconnecting', address: '0xabc' });
      });
      expect(result.current).toEqual({ address: '0xabc', status: 'connected' });
    });
  });
});

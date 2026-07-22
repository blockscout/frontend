// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from 'vitest/lib';

import type { ConnectionHandlers } from '../../utils/bridge';
import { useWalletReown } from './useWalletReown';

const bridgeState = vi.hoisted(() => ({
  account: { address: undefined as string | undefined, status: 'disconnected' as string },
  connectionHandlers: undefined as ConnectionHandlers | undefined,
}));

const runtimeMock = vi.hoisted(() => ({
  isReady: true,
  openModal: vi.fn(() => Promise.resolve()),
  disconnect: vi.fn(() => Promise.resolve()),
  subscribeModalState: vi.fn(() => () => {}),
}));

const mixpanelMock = vi.hoisted(() => ({
  logEvent: vi.fn(),
  userProfile: { setOnce: vi.fn() },
  EventTypes: { WALLET_CONNECT: 'WALLET_CONNECT' },
}));

vi.mock('../../utils/bridge', () => ({
  useWeb3Account: () => bridgeState.account,
  subscribeConnection: (handlers: ConnectionHandlers) => {
    bridgeState.connectionHandlers = handlers;
    return () => {
      bridgeState.connectionHandlers = undefined;
    };
  },
}));

vi.mock('../../utils/runtime', () => ({
  ensureLoaded: () => Promise.resolve(runtimeMock),
}));

vi.mock('src/services/mixpanel', () => mixpanelMock);

describe('useWalletReown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    runtimeMock.isReady = true;
    bridgeState.account = { address: undefined, status: 'disconnected' };
    bridgeState.connectionHandlers = undefined;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('connect', () => {
    it('loads the runtime, opens the modal, and logs WALLET_CONNECT Started', async() => {
      const { result } = renderHook(() => useWalletReown({ source: 'Header' }));
      await act(async() => {
        await result.current.connect();
      });

      expect(runtimeMock.openModal).toHaveBeenCalledTimes(1);
      expect(mixpanelMock.logEvent).toHaveBeenCalledWith('WALLET_CONNECT', { Source: 'Header', Status: 'Started' });
    });

    it('logs WALLET_CONNECT Connected + profile flag on a fresh connection after connect()', async() => {
      const onConnect = vi.fn();
      const { result } = renderHook(() => useWalletReown({ source: 'Header', onConnect }));
      await act(async() => {
        await result.current.connect();
      });
      mixpanelMock.logEvent.mockClear();

      act(() => {
        bridgeState.connectionHandlers?.onConnect?.({ address: '0x1', isReconnected: false });
      });

      expect(mixpanelMock.logEvent).toHaveBeenCalledWith('WALLET_CONNECT', { Source: 'Header', Status: 'Connected' });
      expect(mixpanelMock.userProfile.setOnce).toHaveBeenCalledWith({ 'With Connected Wallet': true });
      expect(onConnect).toHaveBeenCalledTimes(1);
    });

    it('does not log Started, nor arm the user-initiated flag, when the runtime failed to load', async() => {
      runtimeMock.isReady = false;
      const onConnect = vi.fn();
      const { result } = renderHook(() => useWalletReown({ source: 'Header', onConnect }));
      await act(async() => {
        await result.current.connect();
      });

      // the disabled runtime's openModal is a no-op, so nothing was started
      expect(mixpanelMock.logEvent).not.toHaveBeenCalled();

      // and a later bridge connect must not be attributed to this click
      act(() => {
        bridgeState.connectionHandlers?.onConnect?.({ address: '0x1', isReconnected: false });
      });
      expect(mixpanelMock.logEvent).not.toHaveBeenCalled();
      expect(onConnect).not.toHaveBeenCalled();
    });

    it('does not log Connected for an auto-reconnect', async() => {
      const { result } = renderHook(() => useWalletReown({ source: 'Header' }));
      await act(async() => {
        await result.current.connect();
      });
      mixpanelMock.logEvent.mockClear();

      act(() => {
        bridgeState.connectionHandlers?.onConnect?.({ address: '0x1', isReconnected: true });
      });

      expect(mixpanelMock.logEvent).not.toHaveBeenCalled();
    });

    it('does not log Connected when the connection was not user-initiated (openModal, not connect)', async() => {
      const { result } = renderHook(() => useWalletReown({ source: 'Header' }));
      await act(async() => {
        await result.current.openModal();
      });

      expect(mixpanelMock.logEvent).not.toHaveBeenCalled();

      act(() => {
        bridgeState.connectionHandlers?.onConnect?.({ address: '0x1', isReconnected: false });
      });
      expect(mixpanelMock.logEvent).not.toHaveBeenCalled();
    });
  });

  describe('disconnect', () => {
    it('calls the runtime disconnect action', async() => {
      const { result } = renderHook(() => useWalletReown({ source: 'Header' }));
      await act(async() => {
        await result.current.disconnect();
      });
      expect(runtimeMock.disconnect).toHaveBeenCalledTimes(1);
    });
  });

  describe('account state mapping', () => {
    it('is connected with the address when the bridge reports connected', () => {
      bridgeState.account = { address: '0x1', status: 'connected' };
      const { result } = renderHook(() => useWalletReown({ source: 'Header' }));
      expect(result.current.isConnected).toBe(true);
      expect(result.current.isReconnecting).toBe(false);
      expect(result.current.address).toBe('0x1');
    });

    it('shows the optimistic address in reconnecting style (no Connect flash)', () => {
      bridgeState.account = { address: '0x1', status: 'optimistic' };
      const { result } = renderHook(() => useWalletReown({ source: 'Header' }));
      expect(result.current.isConnected).toBe(true);
      expect(result.current.isReconnecting).toBe(true);
      expect(result.current.address).toBe('0x1');
    });

    it('is disconnected when the bridge reports disconnected', () => {
      bridgeState.account = { address: undefined, status: 'disconnected' };
      const { result } = renderHook(() => useWalletReown({ source: 'Header' }));
      expect(result.current.isConnected).toBe(false);
      expect(result.current.isReconnecting).toBe(false);
      expect(result.current.address).toBeUndefined();
    });
  });
});

// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest/lib';

import useAccountReown from './useAccountReown';

const state = vi.hoisted(() => ({
  account: { address: undefined as string | undefined, status: 'disconnected' as string },
}));

vi.mock('../../utils/bridge', () => ({
  useWeb3Account: () => state.account,
}));

describe('useAccountReown', () => {
  beforeEach(() => {
    state.account = { address: undefined, status: 'disconnected' };
  });

  it('maps a connected account', () => {
    state.account = { address: '0x1', status: 'connected' };
    const { result } = renderHook(() => useAccountReown());
    expect(result.current).toMatchObject({
      address: '0x1', isConnected: true, isConnecting: false, isDisconnected: false, isReconnecting: false, status: 'connected',
    });
  });

  it('maps a reconnecting account with the persisted address (no "Connect" flash for a returning user)', () => {
    state.account = { address: '0x1', status: 'reconnecting' };
    const { result } = renderHook(() => useAccountReown());
    expect(result.current).toMatchObject({
      address: '0x1', isConnected: true, isConnecting: false, isDisconnected: false, isReconnecting: true, status: 'reconnecting',
    });
  });

  it('maps a connecting account (not yet connected, no address)', () => {
    state.account = { address: undefined, status: 'connecting' };
    const { result } = renderHook(() => useAccountReown());
    expect(result.current).toMatchObject({
      address: undefined, isConnected: false, isConnecting: true, isDisconnected: false, isReconnecting: false, status: 'connecting',
    });
  });

  it('maps a disconnected account', () => {
    state.account = { address: undefined, status: 'disconnected' };
    const { result } = renderHook(() => useAccountReown());
    expect(result.current).toMatchObject({
      address: undefined, isConnected: false, isConnecting: false, isDisconnected: true, isReconnecting: false, status: 'disconnected',
    });
  });
});

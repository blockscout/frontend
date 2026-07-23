// @vitest-environment jsdom

import React from 'react';
import type { UseAccountEffectParameters } from 'wagmi';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render } from 'vitest/lib';

import AccountPublisher from './AccountPublisher';

const accountState = vi.hoisted(() => ({
  address: undefined as string | undefined,
  status: 'disconnected' as string,
}));

// captured so the test can drive wagmi's connect/disconnect callbacks by hand
const captured = vi.hoisted(() => ({ handlers: undefined as UseAccountEffectParameters | undefined }));

const bridgeMock = vi.hoisted(() => ({
  setWeb3Account: vi.fn(),
  setWalletFlag: vi.fn(),
  clearWalletFlag: vi.fn(),
  emitConnectionChange: vi.fn(),
}));

vi.mock('wagmi', () => ({
  useAccount: () => ({ address: accountState.address, status: accountState.status }),
  useAccountEffect: (handlers: UseAccountEffectParameters) => {
    captured.handlers = handlers;
  },
}));

vi.mock('../utils/bridge', () => bridgeMock);

describe('AccountPublisher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    accountState.address = undefined;
    accountState.status = 'disconnected';
    captured.handlers = undefined;
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('mirrors the confirmed wagmi account into the bridge on mount', () => {
    accountState.address = '0x1';
    accountState.status = 'connected';
    render(<AccountPublisher/>);
    expect(bridgeMock.setWeb3Account).toHaveBeenCalledWith({ address: '0x1', status: 'connected' });
  });

  it('re-mirrors when the wagmi account changes', () => {
    const { rerender } = render(<AccountPublisher/>);
    expect(bridgeMock.setWeb3Account).toHaveBeenLastCalledWith({ address: undefined, status: 'disconnected' });

    accountState.address = '0x1';
    accountState.status = 'connected';
    rerender(<AccountPublisher/>);
    expect(bridgeMock.setWeb3Account).toHaveBeenLastCalledWith({ address: '0x1', status: 'connected' });
  });

  it('clears a stale persisted flag when wagmi settles to disconnected', () => {
    accountState.status = 'disconnected';
    render(<AccountPublisher/>);
    expect(bridgeMock.clearWalletFlag).toHaveBeenCalledTimes(1);
  });

  it('does not clear the persisted flag while reconnecting (returning user, no flash)', () => {
    accountState.address = '0x1';
    accountState.status = 'reconnecting';
    render(<AccountPublisher/>);
    expect(bridgeMock.clearWalletFlag).not.toHaveBeenCalled();
  });

  it('persists the flag and emits a connect event on connect', () => {
    render(<AccountPublisher/>);
    act(() => {
      captured.handlers?.onConnect?.({ address: '0x1', isReconnected: false } as never);
    });
    expect(bridgeMock.setWalletFlag).toHaveBeenCalledWith('0x1');
    expect(bridgeMock.emitConnectionChange).toHaveBeenCalledWith({ type: 'connect', address: '0x1', isReconnected: false });
  });

  it('clears the flag and emits a disconnect event on disconnect', () => {
    render(<AccountPublisher/>);
    bridgeMock.clearWalletFlag.mockClear();
    act(() => {
      captured.handlers?.onDisconnect?.();
    });
    expect(bridgeMock.clearWalletFlag).toHaveBeenCalledTimes(1);
    expect(bridgeMock.emitConnectionChange).toHaveBeenCalledWith({ type: 'disconnect' });
  });

  it('renders nothing', () => {
    const { container } = render(<AccountPublisher/>);
    expect(container.firstChild).toBeNull();
  });
});

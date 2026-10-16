// @vitest-environment jsdom

import { describe, expect, test } from 'vitest';
import { renderHook } from 'vitest/lib';

import { registerDynamicHooks, useAccountDynamicRegistered, useWalletDynamicRegistered } from './dynamic-hooks';

describe('dynamic hooks registry', () => {
  test('throws a pointer to the provider while nothing is registered', () => {
    expect(() => renderHook(() => useAccountDynamicRegistered())).toThrow('<DynamicProvider>');
  });

  test('delegates to the registered hooks synchronously', () => {
    registerDynamicHooks({
      useWallet: ({ source }) => ({
        connect: () => {},
        disconnect: () => {},
        isOpen: false,
        isConnected: true,
        isReconnecting: false,
        address: `0x${ source }`,
        openModal: async() => {},
      }),
      useAccount: () => ({ address: '0xabc', isConnected: true } as never),
    });

    const wallet = renderHook(() => useWalletDynamicRegistered({ source: 'Header' }));
    const account = renderHook(() => useAccountDynamicRegistered());

    expect(wallet.result.current.address).toBe('0xHeader');
    expect(account.result.current.address).toBe('0xabc');
  });
});

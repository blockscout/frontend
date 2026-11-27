// @vitest-environment jsdom

import React from 'react';

import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import { MultichainContext } from 'src/features/multichain/context';
import { chainA } from 'src/features/multichain/mocks/chains';

import { describe, it, expect, afterEach } from 'vitest';
import { renderHook, cleanup } from 'vitest/lib';

import { useNativeToken } from './useNativeToken';

const POLYGON_CHAIN: ClusterChainConfig = {
  ...chainA,
  app_config: {
    ...chainA.app_config,
    chain: {
      ...chainA.app_config.chain,
      currency: { ...chainA.app_config.chain.currency, name: 'Polygon Ecosystem Token', symbol: 'POL' },
    },
  },
};

afterEach(() => {
  cleanup();
});

describe('the native token of the advanced filter', () => {
  it('is the app\'s native coin outside a multichain view', () => {
    const { result } = renderHook(() => useNativeToken());

    expect(result.current).toMatchObject({ address_hash: 'native', symbol: 'ETH' });
  });

  it('is the native coin of the multichain view\'s chain', () => {
    const { result } = renderHook(() => useNativeToken(), {
      wrapper: ({ children }) => <MultichainContext.Provider value={{ chain: POLYGON_CHAIN }}>{ children }</MultichainContext.Provider>,
    });

    expect(result.current).toMatchObject({ address_hash: 'native', symbol: 'POL', name: 'Polygon Ecosystem Token' });
  });
});

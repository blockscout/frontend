// @vitest-environment jsdom

import React from 'react';

import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import { MultichainContext } from 'src/features/multichain/context';
import { chainA } from 'src/features/multichain/mocks/chains';

import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from 'vitest/lib';

import NativeCoinValue from './NativeCoinValue';

const AMOUNT = '1500000000000000000';

const POLYGON_CHAIN: ClusterChainConfig = {
  ...chainA,
  app_config: {
    ...chainA.app_config,
    chain: {
      ...chainA.app_config.chain,
      currency: { ...chainA.app_config.chain.currency, symbol: 'POL', weiName: 'Grain', gweiName: undefined },
    },
  },
};

function renderInChain(chain: ClusterChainConfig, ui: React.ReactElement) {
  return render(<MultichainContext.Provider value={{ chain }}>{ ui }</MultichainContext.Provider>);
}

afterEach(() => {
  cleanup();
});

describe('native coin unit', () => {
  it('is the app\'s native coin outside a multichain view', () => {
    const { container } = render(<NativeCoinValue amount={ AMOUNT } noTooltip/>);

    expect(container.textContent).toMatch(/(?<![\d.])1\.5\s*ETH$/);
  });

  it('is the native coin of the multichain view\'s chain', () => {
    const { container } = renderInChain(POLYGON_CHAIN, <NativeCoinValue amount={ AMOUNT } noTooltip/>);

    expect(container.textContent).toMatch(/(?<![\d.])1\.5\s*POL$/);
  });

  it('names the smaller units after the multichain view\'s chain', () => {
    const wei = renderInChain(POLYGON_CHAIN, <NativeCoinValue amount="42" units="wei" noTooltip/>);
    expect(wei.container.textContent).toMatch(/(?<![\d.])42\s*Grain$/);
    cleanup();

    const gwei = renderInChain(POLYGON_CHAIN, <NativeCoinValue amount="42000000000" units="gwei" noTooltip/>);
    expect(gwei.container.textContent).toMatch(/(?<![\d.])42\s*GGrain$/);
  });

  it('falls back to ETH for a chain with no symbol configured', () => {
    const chain: ClusterChainConfig = {
      ...POLYGON_CHAIN,
      app_config: {
        ...POLYGON_CHAIN.app_config,
        chain: { ...POLYGON_CHAIN.app_config.chain, currency: { ...POLYGON_CHAIN.app_config.chain.currency, symbol: undefined } },
      },
    };
    const { container } = renderInChain(chain, <NativeCoinValue amount={ AMOUNT } noTooltip/>);

    expect(container.textContent).toMatch(/(?<![\d.])1\.5\s*ETH$/);
  });
});

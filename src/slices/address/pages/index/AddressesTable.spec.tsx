// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import BigNumber from 'bignumber.js';
import React from 'react';

import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import { MultichainContext } from 'src/features/multichain/context';
import { chainA } from 'src/features/multichain/mocks/chains';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';

import AddressesTable from './AddressesTable';

const polygonChain = {
  ...chainA,
  id: '137',
  app_config: {
    ...chainA.app_config,
    chain: {
      ...chainA.app_config.chain,
      currency: { name: 'POL', symbol: 'POL', decimals: 18 },
    },
  },
} as unknown as ClusterChainConfig;

describe('AddressesTable', () => {
  afterEach(cleanup);

  it('labels the balance column with the instance\'s native coin', () => {
    render(<AddressesTable items={ [] } totalSupply={ BigNumber(0) } pageStartIndex={ 1 } top={ 0 }/>);

    expect(screen.getByRole('columnheader', { name: /^Balance/ }).textContent).toBe('Balance ETH');
  });

  it('labels the balance column with the selected chain\'s native coin in a multichain context', () => {
    render(
      <MultichainContext.Provider value={{ chain: polygonChain }}>
        <AddressesTable items={ [] } totalSupply={ BigNumber(0) } pageStartIndex={ 1 } top={ 0 }/>
      </MultichainContext.Provider>,
    );

    expect(screen.getByRole('columnheader', { name: /^Balance/ }).textContent).toBe('Balance POL');
  });
});

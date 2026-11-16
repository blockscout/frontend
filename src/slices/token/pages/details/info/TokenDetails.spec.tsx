// SPDX-License-Identifier: LicenseRef-Blockscout
// @vitest-environment jsdom

import React from 'react';

import { tokenCounters } from 'src/slices/token/mocks/info';
import { toTokenModel } from 'src/slices/token/utils/model';

import { describe, expect, it } from 'vitest';
import { render, screen } from 'vitest/lib';

import TokenDetails from './TokenDetails';

const stablecoin = toTokenModel({
  address_hash: '0xe343167631d89B6Ffc58B88d6b7fB0228795491D',
  circulating_market_cap: '2649391549',
  circulating_supply: '2649146868.515489',
  decimals: '6',
  exchange_rate: '1.0',
  holders_count: '7263',
  name: 'Global Dollar',
  symbol: 'GD',
  total_supply: '77573718142411',
  type: 'ERC-20',
  icon_url: null,
  reputation: 'ok',
});

describe('TokenDetails', () => {
  it('scales the raw total supply by the token decimals but shows the circulating supply as sent', () => {
    render(<TokenDetails data={ stablecoin } counters={ tokenCounters } isLoading={ false } isLoadingCounters={ false }/>);

    expect(screen.getByText('77,573,718.142')).toBeTruthy();
    expect(screen.getByText('2,649,146,868.515')).toBeTruthy();
  });
});

// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { getSwapWidgetConfig } from './widget-config';

const SWAP_CONFIG = { chains: [ '1', '10' ], fee: '0.004', integrator: 'blockscout' };

describe('getSwapWidgetConfig', () => {
  it('keeps the integrator fee and limits both sides of a swap to configured chains', () => {
    expect(getSwapWidgetConfig(SWAP_CONFIG, '10', [])).toMatchObject({
      integrator: 'blockscout',
      feeConfig: { fee: 0.004 },
      chains: { allow: [ 1, 10 ] },
      fromChain: 10,
      fromToken: '0x0000000000000000000000000000000000000000',
      hiddenUI: { appearance: true, language: true, gasRefuelMessage: true },
    });
  });

  it.each([ '137', undefined ])('defaults to the first allowed chain when the explorer chain is %s', (chainId) => {
    expect(getSwapWidgetConfig(SWAP_CONFIG, chainId, [])).toMatchObject({ fromChain: 1 });
  });

  it('only sends available explorer URLs for allowed chains', () => {
    const result = getSwapWidgetConfig(SWAP_CONFIG, '1', [
      { id: '1', name: 'Ethereum', explorer_url: 'https://eth.blockscout.com' },
      { id: '10', name: 'Optimism' },
      { id: '137', name: 'Polygon', explorer_url: 'https://polygon.blockscout.com' },
    ]);
    expect(result.explorerUrls).toEqual({ '1': [ 'https://eth.blockscout.com' ] });
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
  });
});

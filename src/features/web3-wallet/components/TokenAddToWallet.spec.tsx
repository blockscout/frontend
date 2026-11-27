// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import * as tokenMock from 'src/slices/token/mocks/info';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from 'vitest/lib';

import TokenAddToWallet from './TokenAddToWallet';

const walletRequest = vi.fn();

const getWatchedAssetDecimals = async(token: schemas['Token']): Promise<unknown> => {
  render(<TokenAddToWallet token={ token }/>);

  fireEvent.click(await screen.findByLabelText('Add token to wallet'));

  await waitFor(() => {
    expect(walletRequest).toHaveBeenCalledWith(expect.objectContaining({ method: 'wallet_watchAsset' }));
  });

  const watchAssetCall = walletRequest.mock.calls.find(([ request ]) => request.method === 'wallet_watchAsset');

  return watchAssetCall?.[0].params.options.decimals;
};

describe('TokenAddToWallet', () => {
  beforeEach(() => {
    walletRequest.mockReset();
    walletRequest.mockResolvedValue(null);
    vi.stubGlobal('ethereum', { isRabby: true, request: walletRequest });
  });

  afterEach(cleanup);

  it('adds a token with zero decimals to the wallet with zero decimals', async() => {
    expect(await getWatchedAssetDecimals({ ...tokenMock.tokenInfoERC20a, decimals: '0' })).toBe(0);
  });

  it('adds a token to the wallet with its own decimals', async() => {
    expect(await getWatchedAssetDecimals({ ...tokenMock.tokenInfoERC20a, decimals: '6' })).toBe(6);
  });

  it('adds a token with unknown decimals to the wallet with 18 decimals', async() => {
    expect(await getWatchedAssetDecimals({ ...tokenMock.tokenInfoERC20a, decimals: null })).toBe(18);
  });
});

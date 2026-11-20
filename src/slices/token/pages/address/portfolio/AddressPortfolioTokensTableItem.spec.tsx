// SPDX-License-Identifier: LicenseRef-Blockscout
// @vitest-environment jsdom

import React from 'react';

import type { AddressFungibleTokensItem } from 'src/slices/token/pages/address/types';

import { chainA, chainB } from 'src/features/multichain/mocks/chains';
import { tokenAA, tokenBA } from 'src/features/multichain/mocks/tokens';

import config from 'src/config';

import { TableBody, TableRoot } from 'src/toolkit/chakra/table';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from 'vitest/lib';

import AddressPortfolioTokensTableItem from './AddressPortfolioTokensTableItem';

const currentChain = { ...chainA, id: String(config.chain.id) };
const otherChain = chainB;

const TOKEN_HASH = tokenAA.token.address_hash;

const currentChainToken: AddressFungibleTokensItem = { ...tokenAA, chain_values: { [currentChain.id]: tokenAA.value } };
const otherChainToken: AddressFungibleTokensItem = tokenBA;

function renderRows(rows: React.ReactNode): void {
  render(<TableRoot><TableBody>{ rows }</TableBody></TableRoot>);
}

function linkTargets(): Array<string | null> {
  return screen.getAllByRole('link').map((link) => link.getAttribute('href'));
}

describe('portfolio token row on a single-chain instance', () => {
  beforeEach(() => {
    vi.stubGlobal('__multichainConfig', { chains: [ currentChain, otherChain ] });
  });

  afterEach(() => {
    cleanup();
  });

  it('links a token of the current chain inside the explorer', () => {
    renderRows(<AddressPortfolioTokensTableItem data={ currentChainToken } isLoading={ false }/>);

    expect(linkTargets()).toEqual([ `/token/${ TOKEN_HASH }`, `/address/${ TOKEN_HASH }` ]);
  });

  it('links a token of another chain to that chain\'s explorer', () => {
    renderRows(<AddressPortfolioTokensTableItem data={ otherChainToken } isLoading={ false }/>);

    expect(linkTargets()).toEqual([
      `${ otherChain.explorer_url }/token/${ TOKEN_HASH }`,
      `${ otherChain.explorer_url }/address/${ TOKEN_HASH }`,
    ]);
  });

  it('offers add-to-wallet only in the row that asks for it', async() => {
    vi.stubGlobal('ethereum', { isMetaMask: true, _events: {}, _state: {} });

    renderRows(
      <>
        <AddressPortfolioTokensTableItem data={ currentChainToken } isLoading={ false } hasAddToWallet/>
        <AddressPortfolioTokensTableItem data={ otherChainToken } isLoading={ false }/>
      </>,
    );

    const [ rowWithControl, rowWithoutControl ] = screen.getAllByRole('row');

    expect(await within(rowWithControl).findByLabelText('Add token to wallet')).toBeTruthy();
    expect(within(rowWithoutControl).queryByLabelText('Add token to wallet')).toBeNull();
  });
});

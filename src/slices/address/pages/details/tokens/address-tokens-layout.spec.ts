// SPDX-License-Identifier: LicenseRef-Blockscout

import type { PaginationParams } from 'src/shared/pagination/types';

import { describe, it, expect } from 'vitest';

import { getAddressTokensPagination, getAddressTokensRightSlotProps, isNftTab } from './address-tokens-layout';

const paginationFor = (page: number): PaginationParams => ({
  page,
  onNextPageClick: () => {},
  onPrevPageClick: () => {},
  resetPage: () => {},
  hasPages: true,
  hasNextPage: true,
  canGoBackwards: false,
  isLoading: false,
  isVisible: true,
});

const PAGINATIONS = {
  fungiblePagination: paginationFor(1),
  nftsPagination: paginationFor(2),
  collectionsPagination: paginationFor(3),
};

describe('isNftTab', () => {
  it.each([ 'tokens', 'tokens_erc20' ])('treats %s as the fungible tab', (tab) => {
    expect(isNftTab(tab)).toBe(false);
  });

  it.each([ 'tokens_nfts', 'tokens_nfts_list', 'tokens_nfts_collection', '' ])('treats %j as an NFT tab', (tab) => {
    expect(isNftTab(tab)).toBe(true);
  });
});

describe('getAddressTokensPagination', () => {
  it('uses the fungible tokens pagination outside the NFT tab', () => {
    expect(getAddressTokensPagination({ tab: 'tokens_erc20', nftDisplayType: 'list', ...PAGINATIONS }).page).toBe(1);
    expect(getAddressTokensPagination({ tab: '', nftDisplayType: 'collection', ...PAGINATIONS }).page).toBe(1);
  });

  it('follows the NFT display type on the NFT tab', () => {
    expect(getAddressTokensPagination({ tab: 'tokens_nfts', nftDisplayType: 'list', ...PAGINATIONS }).page).toBe(2);
    expect(getAddressTokensPagination({ tab: 'tokens_nfts', nftDisplayType: 'collection', ...PAGINATIONS }).page).toBe(3);
  });
});

describe('getAddressTokensRightSlotProps', () => {
  it('leaves the slot unstyled on the mobile NFT tab without a fungible filter', () => {
    expect(getAddressTokensRightSlotProps({ tab: 'tokens_nfts', isMobile: true, hasFungibleTokenFilter: false })).toEqual({});
  });

  it('leaves the slot unstyled on the fungible tab without a filter', () => {
    expect(getAddressTokensRightSlotProps({ tab: 'tokens_erc20', isMobile: false, hasFungibleTokenFilter: false })).toEqual({});
  });

  it('lets the slot take the available width on the desktop NFT tab', () => {
    expect(getAddressTokensRightSlotProps({ tab: 'tokens_nfts', isMobile: false, hasFungibleTokenFilter: false })).toEqual({
      display: 'flex',
      justifyContent: 'space-between',
      ml: 8,
      widthAllocation: 'available',
    });
  });

  it('lets the slot take the available width with a desktop fungible filter', () => {
    expect(getAddressTokensRightSlotProps({ tab: 'tokens_erc20', isMobile: false, hasFungibleTokenFilter: true })).toMatchObject({
      ml: 8,
      widthAllocation: 'available',
    });
  });

  it('pushes a mobile fungible filter to the right at a fixed width', () => {
    expect(getAddressTokensRightSlotProps({ tab: 'tokens_erc20', isMobile: true, hasFungibleTokenFilter: true })).toMatchObject({
      ml: 'auto',
      widthAllocation: 'fixed',
    });
  });
});

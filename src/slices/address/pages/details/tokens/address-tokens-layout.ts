// SPDX-License-Identifier: LicenseRef-Blockscout

import type { PaginationParams } from 'src/shared/pagination/types';

import type { TNftDisplayType } from 'src/slices/token/pages/address/useAddressNftQuery';

import type { SlotProps } from 'src/toolkit/components/AdaptiveTabs/AdaptiveTabsList';

export const NFT_TAB_ID = 'tokens_nfts';

export const isNftTab = (tab: string): boolean => tab !== 'tokens' && tab !== 'tokens_erc20';

interface PaginationParamsInput {
  tab: string;
  nftDisplayType: TNftDisplayType;
  fungiblePagination: PaginationParams;
  nftsPagination: PaginationParams;
  collectionsPagination: PaginationParams;
}

export const getAddressTokensPagination = (params: PaginationParamsInput): PaginationParams => {
  const { tab, nftDisplayType, fungiblePagination, nftsPagination, collectionsPagination } = params;

  if (tab !== NFT_TAB_ID) {
    return fungiblePagination;
  }

  return nftDisplayType === 'list' ? nftsPagination : collectionsPagination;
};

interface RightSlotPropsInput {
  tab: string;
  isMobile: boolean;
  hasFungibleTokenFilter: boolean;
}

export const getAddressTokensRightSlotProps = ({ tab, isMobile, hasFungibleTokenFilter }: RightSlotPropsInput): SlotProps => {
  if (!(tab === NFT_TAB_ID && !isMobile) && !hasFungibleTokenFilter) {
    return {};
  }

  const isMobileFungibleFilter = hasFungibleTokenFilter && isMobile;

  return {
    display: 'flex',
    justifyContent: 'space-between',
    ml: isMobileFungibleFilter ? 'auto' : 8,
    widthAllocation: isMobileFungibleFilter ? 'fixed' : 'available',
  };
};

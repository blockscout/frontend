// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { PaginationParams } from 'src/shared/pagination/types';

import AddressTokenBalances from 'src/slices/token/pages/address/AddressTokenBalances';
import AddressFungibleTokens from 'src/slices/token/pages/address/fungible/AddressFungibleTokens';
import AddressFungibleTokensFilter from 'src/slices/token/pages/address/fungible/AddressFungibleTokensFilter';
import AddressNftDisplayTypeRadio from 'src/slices/token/pages/address/nfts/AddressNftDisplayTypeRadio';
import AddressNfts from 'src/slices/token/pages/address/nfts/AddressNfts';
import AddressNftsCollections from 'src/slices/token/pages/address/nfts/AddressNftsCollections';
import AddressNftTypeFilter from 'src/slices/token/pages/address/nfts/AddressNftTypeFilter';
import useAddressFungibleTokensQuery from 'src/slices/token/pages/address/useAddressFungibleTokensQuery';
import useAddressNftQuery from 'src/slices/token/pages/address/useAddressNftQuery';
import { FUNGIBLE_TOKEN_TYPES } from 'src/slices/token/pages/address/utils';

import config from 'src/config';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import useIsMounted from 'src/shared/hooks/useIsMounted';
import Pagination from 'src/shared/pagination/Pagination';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import RoutedTabs from 'src/toolkit/components/RoutedTabs/RoutedTabs';

const TAB_LIST_PROPS = {
  mb: 0,
  pt: 6,
  pb: 3,
};

interface Props {
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
};

const AddressTokens = ({ shouldRender = true, isQueryEnabled = true }: Props) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const isMounted = useIsMounted();

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const tab = getQueryParamString(router.query.tab);
  const hash = getQueryParamString(router.query.hash);

  const { query: fungibleTokensQuery, tokenTypes: fungibleTokenTypes, onTokenTypesChange: handleFungibleTokenTypesChange } = useAddressFungibleTokensQuery({
    addressHash: hash,
    scrollRef,
    enabled: isQueryEnabled && (tab === 'tokens' || tab === 'tokens_erc20'),
  });

  const { nftsQuery, collectionsQuery, displayType: nftDisplayType, tokenTypes: nftTokenTypes, onDisplayTypeChange, onTokenTypesChange } = useAddressNftQuery({
    scrollRef,
    enabled: isQueryEnabled && tab === 'tokens_nfts',
    addressHash: hash,
  });

  if (!isMounted || !shouldRender) {
    return null;
  }

  const hasActiveFilters = Boolean(nftTokenTypes?.length);

  const tabs = [
    {
      id: 'tokens_erc20',
      title: [
        `${ config.slices.token.standard }-20`,
        ...config.slices.token.additionalTypes.map((item) => item.name),
      ].join(' & '),
      component: (
        <AddressFungibleTokens
          items={ fungibleTokensQuery.data?.items }
          isLoading={ fungibleTokensQuery.isPlaceholderData }
          pagination={ fungibleTokensQuery.pagination }
          isError={ fungibleTokensQuery.isError }
          tokenTypes={ fungibleTokenTypes }
          onTokenTypesChange={ handleFungibleTokenTypesChange }
          resetKey={ fungibleTokensQuery.queryHash }
        />
      ),
    },
    {
      id: 'tokens_nfts',
      title: 'NFTs',
      component: nftDisplayType === 'list' ?
        <AddressNfts tokensQuery={ nftsQuery } tokenTypes={ nftTokenTypes } onTokenTypesChange={ onTokenTypesChange }/> :
        <AddressNftsCollections collectionsQuery={ collectionsQuery } address={ hash } tokenTypes={ nftTokenTypes } onTokenTypesChange={ onTokenTypesChange }/>,
    },
  ];

  let pagination: PaginationParams | undefined;

  if (tab === 'tokens_nfts') {
    pagination = nftDisplayType === 'list' ? nftsQuery.pagination : collectionsQuery.pagination;
  } else {
    pagination = fungibleTokensQuery.pagination;
  }

  const hasNftData =
    (!nftsQuery.isPlaceholderData && nftsQuery.data?.items.length) ||
    (!collectionsQuery.isPlaceholderData && collectionsQuery.data?.items.length);

  const isNftTab = tab !== 'tokens' && tab !== 'tokens_erc20';
  const hasFungibleTokenFilter = !isNftTab && (!isMobile || !pagination.isVisible) && FUNGIBLE_TOKEN_TYPES.length > 1;

  const rightSlot = (
    <>
      <HStack gap={ 3 }>
        { isNftTab && (hasNftData || hasActiveFilters) &&
          <AddressNftDisplayTypeRadio value={ nftDisplayType } onChange={ onDisplayTypeChange }/> }
        { isNftTab && (hasNftData || hasActiveFilters) && !(isMobile && pagination.isVisible) &&
          <AddressNftTypeFilter value={ nftTokenTypes } onChange={ onTokenTypesChange }/> }
        { hasFungibleTokenFilter && <AddressFungibleTokensFilter value={ fungibleTokenTypes } onChange={ handleFungibleTokenTypesChange }/> }
      </HStack>
      { pagination.isVisible && !isMobile && <Pagination { ...pagination }/> }
    </>
  );

  return (
    <>
      <AddressTokenBalances/>
      { /* should stay before tabs to scroll up with pagination */ }
      <Box ref={ scrollRef }></Box>
      <RoutedTabs
        tabs={ tabs }
        variant="secondary"
        size="sm"
        listProps={ TAB_LIST_PROPS }
        rightSlot={ rightSlot }
        rightSlotProps={
          ((tab === 'tokens_nfts' && !isMobile) || hasFungibleTokenFilter) ?
            {
              display: 'flex',
              justifyContent: 'space-between',
              ml: hasFungibleTokenFilter && isMobile ? 'auto' : 8,
              widthAllocation: hasFungibleTokenFilter && isMobile ? 'fixed' : 'available',
            } :
            {}
        }
        stickyEnabled
      />
    </>
  );
};

export default AddressTokens;

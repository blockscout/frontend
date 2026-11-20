// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import AddressFungibleTokens from 'src/slices/token/pages/address/fungible/AddressFungibleTokens';
import AddressFungibleTokensNetWorth from 'src/slices/token/pages/address/fungible/AddressFungibleTokensNetWorth';
import AddressNfts from 'src/slices/token/pages/address/nfts/AddressNfts';
import AddressNftsCollections from 'src/slices/token/pages/address/nfts/AddressNftsCollections';
import useAddressFungibleTokensQuery from 'src/slices/token/pages/address/useAddressFungibleTokensQuery';
import useAddressNftQuery from 'src/slices/token/pages/address/useAddressNftQuery';
import { FUNGIBLE_TOKEN_TYPES } from 'src/slices/token/pages/address/utils';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import useIsMounted from 'src/shared/hooks/useIsMounted';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import { useRouter } from 'src/shared/router/useRouter';

import RoutedTabs from 'src/toolkit/components/RoutedTabs/RoutedTabs';

import { getAddressTokensPagination, getAddressTokensRightSlotProps, isNftTab, NFT_TAB_ID } from './address-tokens-layout';
import AddressTokensRightSlot from './AddressTokensRightSlot';

const TAB_LIST_PROPS = {
  mb: 0,
  mt: { lg: -6 },
  pt: { base: '6px', lg: 6 },
  pb: 3,
};

interface Props {
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
};

const AddressTokens = ({ shouldRender = true, isQueryEnabled = true }: Props) => {
  const router = useRouter();
  const isMobile = Boolean(useIsMobile());
  const isMounted = useIsMounted();

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const tab = getQueryParamString(router.query.tab);
  const hash = getQueryParamString(router.query.hash);

  const { query: fungibleTokensQuery, tokenTypes: fungibleTokenTypes, onTokenTypesChange: handleFungibleTokenTypesChange } = useAddressFungibleTokensQuery({
    addressHash: hash,
    scrollRef,
    enabled: isQueryEnabled && !isNftTab(tab),
  });

  const { nftsQuery, collectionsQuery, displayType: nftDisplayType, tokenTypes: nftTokenTypes, onDisplayTypeChange, onTokenTypesChange } = useAddressNftQuery({
    scrollRef,
    enabled: isQueryEnabled && tab === NFT_TAB_ID,
    addressHash: hash,
  });

  if (!isMounted || !shouldRender) {
    return null;
  }

  const hasActiveFilters = Boolean(nftTokenTypes?.length);

  const tabs = [
    {
      id: 'tokens_erc20',
      title: 'Tokens',
      component: (
        <>
          <Box mb={ 6 }>
            <AddressFungibleTokensNetWorth addressHash={ hash }/>
          </Box>
          <AddressFungibleTokens
            items={ fungibleTokensQuery.data?.items }
            isLoading={ fungibleTokensQuery.isInitialLoading }
            isTransitioning={ fungibleTokensQuery.isTransitioning }
            pagination={ fungibleTokensQuery.pagination }
            isError={ fungibleTokensQuery.isError }
            tokenTypes={ fungibleTokenTypes }
            onTokenTypesChange={ handleFungibleTokenTypesChange }
            resetKey={ fungibleTokensQuery.queryHash }
          />
        </>
      ),
    },
    {
      id: NFT_TAB_ID,
      title: 'NFTs',
      component: nftDisplayType === 'list' ?
        <AddressNfts tokensQuery={ nftsQuery } tokenTypes={ nftTokenTypes } onTokenTypesChange={ onTokenTypesChange }/> :
        <AddressNftsCollections collectionsQuery={ collectionsQuery } address={ hash } tokenTypes={ nftTokenTypes } onTokenTypesChange={ onTokenTypesChange }/>,
    },
  ];

  const pagination = getAddressTokensPagination({
    tab,
    nftDisplayType,
    fungiblePagination: fungibleTokensQuery.pagination,
    nftsPagination: nftsQuery.pagination,
    collectionsPagination: collectionsQuery.pagination,
  });

  const hasNftData =
    Boolean(!nftsQuery.isInitialLoading && nftsQuery.data?.items.length) ||
    Boolean(!collectionsQuery.isInitialLoading && collectionsQuery.data?.items.length);

  const hasFungibleTokenFilter = !isNftTab(tab) && (!isMobile || !pagination.isVisible) && FUNGIBLE_TOKEN_TYPES.length > 1;

  const rightSlot = (
    <AddressTokensRightSlot
      isNftTab={ isNftTab(tab) }
      isMobile={ isMobile }
      pagination={ pagination }
      hasNftControls={ hasNftData || hasActiveFilters }
      nftDisplayType={ nftDisplayType }
      onNftDisplayTypeChange={ onDisplayTypeChange }
      nftTokenTypes={ nftTokenTypes }
      onNftTokenTypesChange={ onTokenTypesChange }
      hasFungibleTokenFilter={ hasFungibleTokenFilter }
      fungibleTokenTypes={ fungibleTokenTypes }
      onFungibleTokenTypesChange={ handleFungibleTokenTypesChange }
    />
  );

  return (
    <>
      { /* should stay before tabs to scroll up with pagination */ }
      <Box ref={ scrollRef }></Box>
      <RoutedTabs
        tabs={ tabs }
        variant="secondary"
        size="sm"
        listProps={ TAB_LIST_PROPS }
        rightSlot={ rightSlot }
        rightSlotProps={ getAddressTokensRightSlotProps({ tab, isMobile, hasFungibleTokenFilter }) }
        stickyEnabled
      />
    </>
  );
};

export default AddressTokens;

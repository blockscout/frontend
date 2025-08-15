import { Box, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import { MultichainProvider } from 'lib/contexts/multichain';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import AddressCollections from 'ui/address/tokens/AddressCollections';
import AddressNftDisplayTypeRadio from 'ui/address/tokens/AddressNftDisplayTypeRadio';
import AddressNFTs from 'ui/address/tokens/AddressNFTs';
import AddressNftTypeFilter from 'ui/address/tokens/AddressNftTypeFilter';
import useAddressNftQuery from 'ui/address/tokens/useAddressNftQuery';
import ChainSelect from 'ui/shared/multichain/ChainSelect';
import Pagination from 'ui/shared/pagination/Pagination';

export const ADDRESS_OP_SUPERCHAIN_TOKENS_TAB_IDS = [ 'tokens_erc20' as const, 'tokens_nfts' as const ];
const TABS_RIGHT_SLOT_PROPS = {
  display: 'flex',
  justifyContent: { base: 'flex-end', lg: 'flex-start' },
  ml: { base: 0, lg: 8 },
  widthAllocation: 'available' as const,
};
const TAB_LIST_PROPS = {
  marginBottom: 0,
  pt: 6,
  pb: 3,
  marginTop: -6,
};

const OpSuperchainAddressTokens = () => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();
  const router = useRouter();

  const tab = getQueryParamString(router.query.tab) as typeof ADDRESS_OP_SUPERCHAIN_TOKENS_TAB_IDS[number] | undefined;
  const hash = getQueryParamString(router.query.hash);

  const { nftsQuery, collectionsQuery, displayType: nftDisplayType, tokenTypes: nftTokenTypes, onDisplayTypeChange, onTokenTypesChange } = useAddressNftQuery({
    scrollRef,
    enabled: tab === 'tokens_nfts',
    addressHash: hash,
    isMultichain: true,
  });

  const hasActiveFilters = (() => {
    if (tab === 'tokens_nfts') {
      return Boolean(nftTokenTypes?.length);
    }

    return false;
  })();

  const rightSlot = (() => {
    if (tab === 'tokens_nfts') {
      const query = nftDisplayType === 'list' ? nftsQuery : collectionsQuery;
      const chainSelect = (
        <ChainSelect
          loading={ query.pagination.isLoading }
          value={ query.chainValue }
          onValueChange={ query.onChainValueChange }
        />
      );

      const hasData =
        (!nftsQuery.isPlaceholderData && nftsQuery.data?.items.length) ||
        (!collectionsQuery.isPlaceholderData && collectionsQuery.data?.items.length);

      return (
        <>
          <HStack gap={ 2 }>
            { (hasData || hasActiveFilters) && !(isMobile && query.pagination.isVisible) &&
              <AddressNftTypeFilter value={ nftTokenTypes } onChange={ onTokenTypesChange }/> }
            { (hasData || hasActiveFilters) && isMobile &&
                <AddressNftDisplayTypeRadio value={ nftDisplayType } onChange={ onDisplayTypeChange } ml={{ base: 0, lg: 6 }}/> }
            { chainSelect }
          </HStack>
          { (hasData || hasActiveFilters) && !isMobile && <AddressNftDisplayTypeRadio value={ nftDisplayType } onChange={ onDisplayTypeChange } ml={ 6 }/> }
          { query.pagination.isVisible && !isMobile && <Pagination { ...query.pagination } ml="auto"/> }
        </>
      );
    }

    return null;
  })();

  const tabs: Array<TabItemRegular> = [
    {
      id: 'tokens_erc20',
      title: 'ERC-20',
      component: <div>Coming soon 🔜</div>,
    },
    {
      id: 'tokens_nfts',
      title: 'NFT',
      component: nftDisplayType === 'list' ? (
        <MultichainProvider chainSlug={ nftsQuery.chainValue?.[0] }>
          <AddressNFTs tokensQuery={ nftsQuery } tokenTypes={ nftTokenTypes } onTokenTypesChange={ onTokenTypesChange }/>
        </MultichainProvider>
      ) : (
        <MultichainProvider chainSlug={ collectionsQuery.chainValue?.[0] }>
          <AddressCollections collectionsQuery={ collectionsQuery } address={ hash } tokenTypes={ nftTokenTypes } onTokenTypesChange={ onTokenTypesChange }/>
        </MultichainProvider>
      ),
    },
  ];

  return (
    <>
      <Box ref={ scrollRef }/>
      <RoutedTabs
        variant="secondary"
        size="sm"
        tabs={ tabs }
        rightSlot={ rightSlot }
        rightSlotProps={ TABS_RIGHT_SLOT_PROPS }
        listProps={ isMobile ? undefined : TAB_LIST_PROPS }
        stickyEnabled={ !isMobile }
      />
    </>
  );
};

export default React.memo(OpSuperchainAddressTokens);

// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';
import type { TabItemRegular } from 'src/toolkit/components/AdaptiveTabs/types';

import AddressNftDisplayTypeRadio from 'src/slices/token/pages/address/nfts/AddressNftDisplayTypeRadio';
import AddressNfts from 'src/slices/token/pages/address/nfts/AddressNfts';
import AddressNftsCollections from 'src/slices/token/pages/address/nfts/AddressNftsCollections';
import AddressNftTypeFilter from 'src/slices/token/pages/address/nfts/AddressNftTypeFilter';
import useAddressNftQuery from 'src/slices/token/pages/address/useAddressNftQuery';

import ChainSelect from 'src/features/multichain/components/ChainSelect';
import { MultichainProvider } from 'src/features/multichain/context';
import { useChainValue } from 'src/features/multichain/hooks/useChainValue';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import Pagination from 'src/shared/pagination/Pagination';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import RoutedTabs from 'src/toolkit/components/RoutedTabs/RoutedTabs';

import getAvailableChainIds from './get-available-chain-ids';
import MultichainAddressPortfolioTokens from './portfolio/MultichainAddressPortfolioTokens';

export const ADDRESS_OP_PORTFOLIO_TAB_IDS = [ 'portfolio_tokens' as const, 'portfolio_nfts' as const ];
const TABS_RIGHT_SLOT_PROPS = {
  display: 'flex',
  justifyContent: { base: 'flex-end', lg: 'flex-start' },
  ml: { base: 0, lg: 6 },
  widthAllocation: 'available' as const,
};
const TAB_LIST_PROPS = {
  marginBottom: 0,
  pt: 6,
  pb: 2,
  marginTop: -6,
};
const TABS_PRESERVED_PARAMS = [ 'chain_id' ];

interface Props {
  addressData: multichain.GetAddressResponse | undefined;
  isLoading: boolean;
}

const MultichainAddressPortfolio = ({ addressData, isLoading }: Props) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();
  const router = useRouter();

  const tab = getQueryParamString(router.query.tab) as typeof ADDRESS_OP_PORTFOLIO_TAB_IDS[number] | 'portfolio' | undefined;
  const hash = getQueryParamString(router.query.hash);
  const chainIds = React.useMemo(() => getAvailableChainIds(addressData), [ addressData ]);
  const { chainValue, chain, onChainValueChange } = useChainValue({ chainIds, scrollRef });

  const { nftsQuery, collectionsQuery, displayType: nftDisplayType, tokenTypes: nftTokenTypes, onDisplayTypeChange, onTokenTypesChange } = useAddressNftQuery({
    scrollRef,
    enabled: !isLoading && tab === 'portfolio_nfts' && chainIds.length > 0,
    addressHash: hash,
    chain,
  });

  const hasActiveFilters = (() => {
    if (tab === 'portfolio_nfts') {
      return Boolean(nftTokenTypes?.length);
    }

    return false;
  })();

  const rightSlot = (() => {
    if (tab === 'portfolio_nfts') {
      const query = nftDisplayType === 'list' ? nftsQuery : collectionsQuery;
      const chainSelect = (
        <ChainSelect
          loading={ query.pagination.isLoading }
          value={ chainValue }
          onValueChange={ onChainValueChange }
          chainIds={ chainIds }
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
  })();

  const tabs: Array<TabItemRegular> = [
    {
      id: 'portfolio_tokens',
      title: 'Tokens',
      component: <MultichainAddressPortfolioTokens addressData={ addressData } isLoading={ isLoading }/>,
    },
    {
      id: 'portfolio_nfts',
      title: 'NFTs',
      component: nftDisplayType === 'list' ? (
        <MultichainProvider chainId={ chain?.id }>
          <AddressNfts tokensQuery={ nftsQuery } tokenTypes={ nftTokenTypes } onTokenTypesChange={ onTokenTypesChange }/>
        </MultichainProvider>
      ) : (
        <MultichainProvider chainId={ chain?.id }>
          <AddressNftsCollections
            collectionsQuery={ collectionsQuery }
            address={ hash }
            tokenTypes={ nftTokenTypes }
            onTokenTypesChange={ onTokenTypesChange }
          />
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
        preservedParams={ TABS_PRESERVED_PARAMS }
      />
    </>
  );
};

export default React.memo(MultichainAddressPortfolio);

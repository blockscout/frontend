import { Box, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';
import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import { MultichainProvider } from 'lib/contexts/multichain';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import { TOKEN } from 'stubs/optimismSuperchain';
import { generateListStub } from 'stubs/utils';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import AddressCollections from 'ui/address/tokens/AddressCollections';
import AddressNftDisplayTypeRadio from 'ui/address/tokens/AddressNftDisplayTypeRadio';
import AddressNFTs from 'ui/address/tokens/AddressNFTs';
import AddressNftTypeFilter from 'ui/address/tokens/AddressNftTypeFilter';
import ERC20Tokens from 'ui/address/tokens/ERC20Tokens';
import useAddressNftQuery from 'ui/address/tokens/useAddressNftQuery';
import ChainSelect from 'ui/optimismSuperchain/components/ChainSelect';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import getAvailableChainIds from './getAvailableChainIds';
import OpSuperchainTokenBalances from './tokens/OpSuperchainTokenBalances';
import useChainSelectErc20 from './useChainSelectErc20';

export const ADDRESS_OP_SUPERCHAIN_TOKENS_TAB_IDS = [ 'tokens_erc20' as const, 'tokens_nfts' as const ];
const TABS_RIGHT_SLOT_PROPS = {
  display: 'flex',
  justifyContent: { base: 'flex-end', lg: 'flex-start' },
  ml: { base: 0, lg: 6 },
  widthAllocation: 'available' as const,
};
const TAB_LIST_PROPS = {
  marginBottom: 0,
  pt: 6,
  pb: 3,
  marginTop: -6,
};

interface Props {
  addressData: multichain.GetAddressResponse | undefined;
}

const OpSuperchainAddressTokens = ({ addressData }: Props) => {
  const chainIds = React.useMemo(() => getAvailableChainIds(addressData), [ addressData ]);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();
  const router = useRouter();

  const tab = getQueryParamString(router.query.tab) as typeof ADDRESS_OP_SUPERCHAIN_TOKENS_TAB_IDS[number] | 'tokens' | undefined;
  const hash = getQueryParamString(router.query.hash);
  const [ chainSelectErc20Value, setChainSelectErc20Value ] = useChainSelectErc20({ chainIds });

  const chainId = chainSelectErc20Value?.filter(Boolean);

  const erc20Query = useQueryWithPages({
    resourceName: 'multichainAggregator:address_tokens',
    pathParams: { hash },
    filters: chainId?.length ? { type: 'ERC-20', chain_id: chainId.includes('all') ? undefined : chainId.filter(Boolean) } : { type: 'ERC-20' },
    scrollRef,
    options: {
      enabled: (tab === 'tokens' || tab === 'tokens_erc20'),
      placeholderData: generateListStub<'multichainAggregator:address_tokens'>(TOKEN, 10, { next_page_params: undefined }),
    },
  });

  const { nftsQuery, collectionsQuery, displayType: nftDisplayType, tokenTypes: nftTokenTypes, onDisplayTypeChange, onTokenTypesChange } = useAddressNftQuery({
    scrollRef,
    enabled: tab === 'tokens_nfts',
    addressHash: hash,
    isMultichain: true,
  });

  const handelChainSelectErc20ValueChange = React.useCallback(({ value }: { value: Array<string> }) => {
    erc20Query.onFilterChange({ chain_id: value.includes('all') ? undefined : value.filter(Boolean) });
    setChainSelectErc20Value(value);
  }, [ setChainSelectErc20Value, erc20Query ]);

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

    return (
      <>
        <ChainSelect
          loading={ erc20Query.pagination.isLoading }
          value={ chainSelectErc20Value }
          onValueChange={ handelChainSelectErc20ValueChange }
          chainIds={ chainIds }
          withAllOption
        />
        { erc20Query.pagination.isVisible && !isMobile && <Pagination { ...erc20Query.pagination } ml="auto"/> }
      </>
    );
  })();

  const tabs: Array<TabItemRegular> = [
    {
      id: 'tokens_erc20',
      title: 'ERC-20',
      component: (
        <ERC20Tokens
          items={ erc20Query.data?.items }
          isLoading={ erc20Query.isPlaceholderData }
          pagination={ erc20Query.pagination }
          isError={ erc20Query.isError }
          top={ erc20Query.pagination.isVisible ? 68 : 0 }
        />
      ),
    },
    {
      id: 'tokens_nfts',
      title: 'NFT',
      component: nftDisplayType === 'list' ? (
        <MultichainProvider chainId={ nftsQuery.chainValue?.[0] }>
          <AddressNFTs tokensQuery={ nftsQuery } tokenTypes={ nftTokenTypes } onTokenTypesChange={ onTokenTypesChange }/>
        </MultichainProvider>
      ) : (
        <MultichainProvider chainId={ collectionsQuery.chainValue?.[0] }>
          <AddressCollections collectionsQuery={ collectionsQuery } address={ hash } tokenTypes={ nftTokenTypes } onTokenTypesChange={ onTokenTypesChange }/>
        </MultichainProvider>
      ),
    },
  ];

  return (
    <>
      <OpSuperchainTokenBalances/>
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

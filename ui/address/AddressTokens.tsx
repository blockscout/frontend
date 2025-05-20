import { Box, chakra, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { NFTTokenType } from 'types/api/token';
import type { PaginationParams } from 'ui/shared/pagination/types';

import config from 'configs/app';
import { useAppContext } from 'lib/contexts/app';
import * as cookies from 'lib/cookies';
import getFilterValuesFromQuery from 'lib/getFilterValuesFromQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import useIsMounted from 'lib/hooks/useIsMounted';
import getQueryParamString from 'lib/router/getQueryParamString';
import { NFT_TOKEN_TYPE_IDS } from 'lib/token/tokenTypes';
import { ADDRESS_TOKEN_BALANCE_ERC_20, ADDRESS_NFT_1155, ADDRESS_COLLECTION } from 'stubs/address';
import { generateListStub } from 'stubs/utils';
import { Button, ButtonGroupRadio } from 'toolkit/chakra/button';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import PopoverFilter from 'ui/shared/filters/PopoverFilter';
import TokenTypeFilter from 'ui/shared/filters/TokenTypeFilter';
import IconSvg from 'ui/shared/IconSvg';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import AddressCollections from './tokens/AddressCollections';
import AddressNFTs from './tokens/AddressNFTs';
import ERC20Tokens from './tokens/ERC20Tokens';
import TokenBalances from './tokens/TokenBalances';

type TNftDisplayType = 'collection' | 'list';

const TAB_LIST_PROPS = {
  mt: 1,
  mb: { base: 6, lg: 1 },
  py: 5,
};

const TAB_LIST_PROPS_MOBILE = {
  my: 8,
};

const getTokenFilterValue: (type: string | Array<string> | undefined) => Array<NFTTokenType> | undefined =
(getFilterValuesFromQuery<NFTTokenType>).bind(null, NFT_TOKEN_TYPE_IDS);

type Props = {
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
};

const AddressTokens = ({ shouldRender = true, isQueryEnabled = true }: Props) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const isMounted = useIsMounted();

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const displayTypeCookie = cookies.get(cookies.NAMES.ADDRESS_NFT_DISPLAY_TYPE, useAppContext().cookies);
  const [ nftDisplayType, setNftDisplayType ] = React.useState<TNftDisplayType>(displayTypeCookie === 'list' ? 'list' : 'collection');
  const [ tokenTypes, setTokenTypes ] = React.useState<Array<NFTTokenType> | undefined>(getTokenFilterValue(router.query.type) || []);

  const tab = getQueryParamString(router.query.tab);
  const hash = getQueryParamString(router.query.hash);

  const erc20Query = useQueryWithPages({
    resourceName: 'general:address_tokens',
    pathParams: { hash },
    filters: { type: 'ERC-20' },
    scrollRef,
    options: {
      enabled: isQueryEnabled && (!tab || tab === 'tokens' || tab === 'tokens_erc20'),
      refetchOnMount: false,
      placeholderData: generateListStub<'general:address_tokens'>(ADDRESS_TOKEN_BALANCE_ERC_20, 10, { next_page_params: null }),
    },
  });

  const collectionsQuery = useQueryWithPages({
    resourceName: 'general:address_collections',
    pathParams: { hash },
    scrollRef,
    options: {
      enabled: isQueryEnabled && tab === 'tokens_nfts' && nftDisplayType === 'collection',
      placeholderData: generateListStub<'general:address_collections'>(ADDRESS_COLLECTION, 10, { next_page_params: null }),
    },
    filters: { type: tokenTypes },
  });

  const nftsQuery = useQueryWithPages({
    resourceName: 'general:address_nfts',
    pathParams: { hash },
    scrollRef,
    options: {
      enabled: isQueryEnabled && tab === 'tokens_nfts' && nftDisplayType === 'list',
      placeholderData: generateListStub<'general:address_nfts'>(ADDRESS_NFT_1155, 10, { next_page_params: null }),
    },
    filters: { type: tokenTypes },
  });

  const handleNFTsDisplayTypeChange = React.useCallback((val: string) => {
    cookies.set(cookies.NAMES.ADDRESS_NFT_DISPLAY_TYPE, val);
    setNftDisplayType(val as TNftDisplayType);
  }, []);

  const handleTokenTypesChange = React.useCallback((value: Array<NFTTokenType>) => {
    nftsQuery.onFilterChange({ type: value });
    collectionsQuery.onFilterChange({ type: value });
    setTokenTypes(value);
  }, [ nftsQuery, collectionsQuery ]);

  if (!isMounted || !shouldRender) {
    return null;
  }

  const nftTypeFilter = (
    <PopoverFilter contentProps={{ w: '200px' }} appliedFiltersNum={ tokenTypes?.length }>
      <TokenTypeFilter<NFTTokenType> nftOnly onChange={ handleTokenTypesChange } defaultValue={ tokenTypes }/>
    </PopoverFilter>
  );

  const hasActiveFilters = Boolean(tokenTypes?.length);

  const tabs = [
    { id: 'tokens_erc20', title: `${ config.chain.tokenStandard }-20`, component: <ERC20Tokens tokensQuery={ erc20Query }/> },
    {
      id: 'tokens_nfts',
      title: 'NFTs',
      component: nftDisplayType === 'list' ?
        <AddressNFTs tokensQuery={ nftsQuery } hasActiveFilters={ hasActiveFilters }/> :
        <AddressCollections collectionsQuery={ collectionsQuery } address={ hash } hasActiveFilters={ hasActiveFilters }/>,
    },
  ];

  const nftDisplayTypeRadio = (
    <ButtonGroupRadio
      defaultValue={ nftDisplayType }
      onChange={ handleNFTsDisplayTypeChange }
      equalWidth
    >
      <Button value="collection" size="sm" px={ 3 }>
        <IconSvg name="collection" boxSize={ 5 }/>
        <chakra.span hideBelow="lg">By collection</chakra.span>
      </Button>
      <Button value="list" size="sm" px={ 3 }>
        <IconSvg name="apps" boxSize={ 5 }/>
        <chakra.span hideBelow="lg">List</chakra.span>
      </Button>
    </ButtonGroupRadio>
  );

  let pagination: PaginationParams | undefined;

  if (tab === 'tokens_nfts') {
    pagination = nftDisplayType === 'list' ? nftsQuery.pagination : collectionsQuery.pagination;
  } else {
    pagination = erc20Query.pagination;
  }

  const hasNftData =
    (!nftsQuery.isPlaceholderData && nftsQuery.data?.items.length) ||
    (!collectionsQuery.isPlaceholderData && collectionsQuery.data?.items.length);

  const isNftTab = tab !== 'tokens' && tab !== 'tokens_erc20';

  const rightSlot = (
    <>
      <HStack gap={ 3 }>
        { isNftTab && (hasNftData || hasActiveFilters) && nftDisplayTypeRadio }
        { isNftTab && (hasNftData || hasActiveFilters) && nftTypeFilter }
      </HStack>
      { pagination.isVisible && !isMobile && <Pagination { ...pagination }/> }
    </>
  );

  return (
    <>
      <TokenBalances/>
      { /* should stay before tabs to scroll up with pagination */ }
      <Box ref={ scrollRef }></Box>
      <RoutedTabs
        tabs={ tabs }
        variant="secondary"
        size="sm"
        listProps={ isMobile ? TAB_LIST_PROPS_MOBILE : TAB_LIST_PROPS }
        rightSlot={ rightSlot }
        rightSlotProps={ tab === 'tokens_nfts' && !isMobile ? { display: 'flex', justifyContent: 'space-between', ml: 8, widthAllocation: 'available' } : {} }
        stickyEnabled={ !isMobile }
      />
    </>
  );
};

export default AddressTokens;

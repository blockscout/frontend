import { Box, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { PaginationParams } from 'ui/shared/pagination/types';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import useIsMounted from 'lib/hooks/useIsMounted';
import getQueryParamString from 'lib/router/getQueryParamString';
import { ADDRESS_TOKEN_BALANCE_ERC_20 } from 'stubs/address';
import { generateListStub } from 'stubs/utils';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import AddressCollections from './tokens/AddressCollections';
import AddressNftDisplayTypeRadio from './tokens/AddressNftDisplayTypeRadio';
import AddressNFTs from './tokens/AddressNFTs';
import AddressNftTypeFilter from './tokens/AddressNftTypeFilter';
import ERC20Tokens from './tokens/ERC20Tokens';
import TokenBalances from './tokens/TokenBalances';
import useAddressNftQuery from './tokens/useAddressNftQuery';

const TAB_LIST_PROPS = {
  mt: 1,
  mb: { base: 6, lg: 1 },
  py: 5,
};

const TAB_LIST_PROPS_MOBILE = {
  my: 8,
};

type Props = {
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
    { id: 'tokens_erc20', title: `${ config.chain.tokenStandard }-20`, component: <ERC20Tokens tokensQuery={ erc20Query }/> },
    {
      id: 'tokens_nfts',
      title: 'NFTs',
      component: nftDisplayType === 'list' ?
        <AddressNFTs tokensQuery={ nftsQuery } tokenTypes={ nftTokenTypes } onTokenTypesChange={ onTokenTypesChange }/> :
        <AddressCollections collectionsQuery={ collectionsQuery } address={ hash } tokenTypes={ nftTokenTypes } onTokenTypesChange={ onTokenTypesChange }/>,
    },
  ];

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
        { isNftTab && (hasNftData || hasActiveFilters) &&
          <AddressNftDisplayTypeRadio value={ nftDisplayType } onChange={ onDisplayTypeChange }/> }
        { isNftTab && (hasNftData || hasActiveFilters) && !(isMobile && pagination.isVisible) &&
          <AddressNftTypeFilter value={ nftTokenTypes } onChange={ onTokenTypesChange }/> }
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

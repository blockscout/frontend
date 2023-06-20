import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TokenType } from 'types/api/token';
import type { PaginationParams } from 'ui/shared/pagination/types';

import useIsMobile from 'lib/hooks/useIsMobile';
import { ADDRESS_TOKEN_BALANCE_ERC_1155, ADDRESS_TOKEN_BALANCE_ERC_20, ADDRESS_TOKEN_BALANCE_ERC_721 } from 'stubs/address';
import { generateListStub } from 'stubs/utils';
import { tokenTabsByType } from 'ui/pages/Address';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';

import ERC1155Tokens from './tokens/ERC1155Tokens';
import ERC20Tokens from './tokens/ERC20Tokens';
import ERC721Tokens from './tokens/ERC721Tokens';
import TokenBalances from './tokens/TokenBalances';

const TAB_LIST_PROPS = {
  marginBottom: 0,
  py: 5,
  marginTop: 3,
  columnGap: 3,
};

const TAB_LIST_PROPS_MOBILE = {
  mt: 8,
  columnGap: 3,
};

const AddressTokens = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const tab = router.query.tab?.toString();
  const tokenType: TokenType = (Object.keys(tokenTabsByType) as Array<TokenType>).find(key => tokenTabsByType[key] === tab) || 'ERC-20';

  const erc20Query = useQueryWithPages({
    resourceName: 'address_tokens',
    pathParams: { hash: router.query.hash?.toString() },
    filters: { type: 'ERC-20' },
    scrollRef,
    options: {
      refetchOnMount: false,
      enabled: tokenType === 'ERC-20',
      placeholderData: generateListStub<'address_tokens'>(ADDRESS_TOKEN_BALANCE_ERC_20, 10, { next_page_params: null }),
    },
  });

  const erc721Query = useQueryWithPages({
    resourceName: 'address_tokens',
    pathParams: { hash: router.query.hash?.toString() },
    filters: { type: 'ERC-721' },
    scrollRef,
    options: {
      refetchOnMount: false,
      enabled: tokenType === 'ERC-721',
      placeholderData: generateListStub<'address_tokens'>(ADDRESS_TOKEN_BALANCE_ERC_721, 10, { next_page_params: null }),
    },
  });

  const erc1155Query = useQueryWithPages({
    resourceName: 'address_tokens',
    pathParams: { hash: router.query.hash?.toString() },
    filters: { type: 'ERC-1155' },
    scrollRef,
    options: {
      refetchOnMount: false,
      enabled: tokenType === 'ERC-1155',
      placeholderData: generateListStub<'address_tokens'>(ADDRESS_TOKEN_BALANCE_ERC_1155, 10, { next_page_params: null }),
    },
  });

  const tabs = [
    { id: tokenTabsByType['ERC-20'], title: 'ERC-20', component: <ERC20Tokens tokensQuery={ erc20Query }/> },
    { id: tokenTabsByType['ERC-721'], title: 'ERC-721', component: <ERC721Tokens tokensQuery={ erc721Query }/> },
    { id: tokenTabsByType['ERC-1155'], title: 'ERC-1155', component: <ERC1155Tokens tokensQuery={ erc1155Query }/> },
  ];

  let pagination: PaginationParams | undefined;

  if (tab === tokenTabsByType['ERC-1155']) {
    pagination = erc1155Query.pagination;
  } else if (tab === tokenTabsByType['ERC-721']) {
    pagination = erc721Query.pagination;
  } else {
    pagination = erc20Query.pagination;
  }

  return (
    <>
      <TokenBalances/>
      { /* should stay before tabs to scroll up with pagination */ }
      <Box ref={ scrollRef }></Box>
      <RoutedTabs
        tabs={ tabs }
        variant="outline"
        colorScheme="gray"
        size="sm"
        tabListProps={ isMobile ? TAB_LIST_PROPS_MOBILE : TAB_LIST_PROPS }
        rightSlot={ pagination.isVisible && !isMobile ? <Pagination { ...pagination }/> : null }
        stickyEnabled={ !isMobile }
      />
    </>
  );
};

export default AddressTokens;

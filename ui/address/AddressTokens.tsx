import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TokenType } from 'types/api/tokenInfo';

import useIsMobile from 'lib/hooks/useIsMobile';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import { tokenTabsByType } from 'ui/pages/Address';
import Pagination from 'ui/shared/Pagination';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';

import TokenBalances from './tokens/TokenBalances';
import TokensWithIds from './tokens/TokensWithIds';
import TokensWithoutIds from './tokens/TokensWithoutIds';

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

  const tokenType: TokenType = (Object.keys(tokenTabsByType) as Array<TokenType>).find(key => tokenTabsByType[key] === router.query.tab) || 'ERC-20';

  const tokensQuery = useQueryWithPages({
    resourceName: 'address_tokens',
    pathParams: { id: router.query.id?.toString() },
    filters: { type: tokenType },
    scrollRef,
  });

  const tabs = [
    { id: tokenTabsByType['ERC-20'], title: 'ERC-20', component: <TokensWithoutIds tokensQuery={ tokensQuery }/> },
    { id: tokenTabsByType['ERC-721'], title: 'ERC-721', component: <TokensWithoutIds tokensQuery={ tokensQuery }/> },
    { id: tokenTabsByType['ERC-1155'], title: 'ERC-1155', component: <TokensWithIds tokensQuery={ tokensQuery }/> },
  ];

  return (
    <>
      <TokenBalances/>
      { /* should stay before tabs to scroll up whith pagination */ }
      <Box ref={ scrollRef }></Box>
      <RoutedTabs
        tabs={ tabs }
        variant="outline"
        colorScheme="gray"
        size="sm"
        tabListProps={ isMobile ? TAB_LIST_PROPS_MOBILE : TAB_LIST_PROPS }
        rightSlot={ tokensQuery.isPaginationVisible && !isMobile ? <Pagination { ...tokensQuery.pagination }/> : null }
        stickyEnabled={ !isMobile }
      />
    </>
  );
};

export default AddressTokens;

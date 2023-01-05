import { useRouter } from 'next/router';
import React from 'react';

import type { TokenType } from 'types/api/tokenInfo';
import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import useIsMobile from 'lib/hooks/useIsMobile';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import { tokenTabsByType } from 'ui/pages/Address';
import Pagination from 'ui/shared/Pagination';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';

import TokenBalances from './tokens/TokenBalances';

type Props = {
  tabs: Array<RoutedTab>;
}

const AddressTokens = ({ tabs }: Props) => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const tokenType: TokenType = (Object.keys(tokenTabsByType) as Array<TokenType>).find(key => tokenTabsByType[key] === router.query.tab) || 'ERC-20';

  const { pagination, isPaginationVisible } = useQueryWithPages({
    resourceName: 'address_tokens',
    pathParams: { id: router.query.id?.toString() },
    filters: { type: tokenType },
  });

  const TAB_LIST_PROPS = {
    marginBottom: 0,
    py: 5,
    marginTop: 3,
    columnGap: 3,
  };

  return (
    <>
      <TokenBalances/>
      <RoutedTabs
        tabs={ tabs }
        variant="outline"
        colorScheme="gray"
        size="sm"
        tabListProps={ isMobile ? { mt: 8, columnGap: 3 } : TAB_LIST_PROPS }
        rightSlot={ isPaginationVisible && !isMobile ? <Pagination { ...pagination }/> : null }
        stickyEnabled={ !isMobile }
      />
    </>
  );
};

export default AddressTokens;

import { Show, Hide } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TokenType } from 'types/api/token';

import { getTokenTransfersStub } from 'stubs/token';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PopoverFilter from 'ui/shared/filters/PopoverFilter';
import TokenTypeFilter from 'ui/shared/filters/TokenTypeFilter';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import { getTokenFilterValue } from 'ui/tokens/utils';
import TokenTransfersListItem from 'ui/tokenTransfers/TokenTransfersListItem';
import TokenTransfersTable from 'ui/tokenTransfers/TokenTransfersTable';
const TokenTransfers = () => {
  const router = useRouter();
  const [ typeFilter, setTypeFilter ] = React.useState<Array<TokenType>>(getTokenFilterValue(router.query.type) || []);

  const tokenTransfersQuery = useQueryWithPages({
    resourceName: 'token_transfers_all',
    filters: { type: typeFilter },
    options: {
      placeholderData: getTokenTransfersStub(),
    },
  });

  const handleTokenTypesChange = React.useCallback((value: Array<TokenType>) => {
    tokenTransfersQuery.onFilterChange({ type: value });
    setTypeFilter(value);
  }, [ tokenTransfersQuery ]);

  const content = (
    <>
      <Show below="lg" ssr={ false }>
        { tokenTransfersQuery.data?.items.map((item, index) => (
          <TokenTransfersListItem
            key={ item.transaction_hash + item.log_index + (tokenTransfersQuery.isPlaceholderData ? index : '') }
            isLoading={ tokenTransfersQuery.isPlaceholderData }
            item={ item }
          />
        )) }
      </Show>
      <Hide below="lg" ssr={ false }>
        <TokenTransfersTable
          items={ tokenTransfersQuery.data?.items }
          top={ tokenTransfersQuery.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ tokenTransfersQuery.isPlaceholderData }
        />
      </Hide>
    </>
  );

  const filter = (
    <PopoverFilter contentProps={{ w: '200px' }} appliedFiltersNum={ typeFilter.length }>
      <TokenTypeFilter<TokenType> onChange={ handleTokenTypesChange } defaultValue={ typeFilter } nftOnly={ false }/>
    </PopoverFilter>
  );

  const actionBar = (
    <ActionBar mt={ -6 }>
      { filter }
      <Pagination { ...tokenTransfersQuery.pagination }/>
    </ActionBar>
  );

  return (
    <>
      <PageTitle
        title="Token Transfers"
        withTextAd
      />
      <DataListDisplay
        isError={ tokenTransfersQuery.isError }
        items={ tokenTransfersQuery.data?.items }
        emptyText="There are no token transfers."
        content={ content }
        actionBar={ actionBar }
      />
    </>
  );
};

export default TokenTransfers;

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TokenType } from 'types/api/token';

import { apos } from 'toolkit/utils/htmlEntities';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PopoverFilter from 'ui/shared/filters/PopoverFilter';
import TokenTypeFilter from 'ui/shared/filters/TokenTypeFilter';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import TokenTransfersListItem from 'ui/tokenTransfers/TokenTransfersListItem';
import TokenTransfersTable from 'ui/tokenTransfers/TokenTransfersTable';
import useTokenTransfersQuery from 'ui/tokenTransfers/useTokenTransfersQuery';

const TokenTransfers = () => {
  const { query, typeFilter, onTokenTypesChange } = useTokenTransfersQuery({ enabled: true });

  const content = (
    <>
      <Box hideFrom="lg">
        { query.data?.items.map((item, index) => (
          <TokenTransfersListItem
            key={ item.transaction_hash + item.log_index + (query.isPlaceholderData ? index : '') }
            isLoading={ query.isPlaceholderData }
            item={ item }
          />
        )) }
      </Box>
      <Box hideBelow="lg">
        <TokenTransfersTable
          items={ query.data?.items }
          top={ query.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ query.isPlaceholderData }
        />
      </Box>
    </>
  );

  const filter = (
    <PopoverFilter contentProps={{ w: '200px' }} appliedFiltersNum={ typeFilter.length }>
      <TokenTypeFilter<TokenType> onChange={ onTokenTypesChange } defaultValue={ typeFilter } nftOnly={ false }/>
    </PopoverFilter>
  );

  const actionBar = (
    <ActionBar mt={ -6 }>
      { filter }
      <Pagination { ...query.pagination }/>
    </ActionBar>
  );

  return (
    <>
      <PageTitle
        title="Token transfers"
        withTextAd
      />
      <DataListDisplay
        isError={ query.isError }
        itemsNum={ query.data?.items.length }
        emptyText="There are no token transfers."
        actionBar={ actionBar }
        filterProps={{
          hasActiveFilters: Boolean(typeFilter.length),
          emptyFilteredText: `Couldn${ apos }t find any token transfer that matches your query.`,
        }}
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default TokenTransfers;

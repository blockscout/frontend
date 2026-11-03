// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import ActionBar from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import InternalTxsTable from 'src/slices/internal-tx/components/InternalTxsTable';
import useInternalTxsQuery from 'src/slices/internal-tx/hooks/useInternalTxsQuery';

import ChainSelect from 'src/features/multichain/components/ChainSelect';
import { MultichainProvider } from 'src/features/multichain/context';
import { useChainValue } from 'src/features/multichain/hooks/useChainValue';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';
import { FilterInput } from 'src/toolkit/components/filters/FilterInput';

const MultichainInternalTxs = () => {
  const isMobile = useIsMobile();

  const { chainValue, chain, onChainValueChange } = useChainValue();
  const { query, searchTerm, onSearchTermChange } = useInternalTxsQuery({ chain });
  const { isError, isInitialLoading, data, pagination } = query;

  const filterInput = (
    <FilterInput
      w={{ base: '100%', lg: '350px' }}
      size="sm"
      onChange={ onSearchTermChange }
      placeholder="Search by transaction hash"
      initialValue={ searchTerm }
      ml={{ base: 0, lg: 2 }}
    />
  );

  const chainSelect = (
    <ChainSelect
      value={ chainValue }
      onValueChange={ onChainValueChange }
    />
  );

  const actionBar = (
    <>
      { isMobile && (
        <Box mb={ 6 }>
          { filterInput }
        </Box>
      ) }
      <ActionBar mt={ -6 } justifyContent="flex-start">
        { chainSelect }
        { !isMobile && filterInput }
        <Pagination ml="auto" { ...pagination }/>
      </ActionBar>
    </>
  );

  const content = data?.items ? (
    <MultichainProvider chainId={ chain?.id }>
      <TableContainerScrollable>
        <InternalTxsTable data={ data.items } isLoading={ isInitialLoading } resetKey={ query.queryHash }/>
      </TableContainerScrollable>
    </MultichainProvider>
  ) : null;

  return (
    <>
      <PageTitle
        title="Internal transactions"
        withTextAd
      />
      <DataList
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no internal transactions."
        hasActiveFilters={ Boolean(searchTerm) }
        emptyStateProps={{
          term: 'internal transaction',
        }}
        actionBar={ actionBar }
        showActionBarIfError
        showActionBarIfEmpty
        isTransitioning={ query.isTransitioning }
      >
        { content }
      </DataList>
    </>
  );
};

export default React.memo(MultichainInternalTxs);

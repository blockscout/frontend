// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import PageTitle from 'client/shell/page/title/PageTitle';

import InternalTxsList from 'client/slices/internal-tx/components/InternalTxsList';
import InternalTxsTable from 'client/slices/internal-tx/components/InternalTxsTable';
import useInternalTxsQuery from 'client/slices/internal-tx/hooks/useInternalTxsQuery';

import ChainSelect from 'client/features/multichain/components/ChainSelect';
import { MultichainProvider } from 'client/features/multichain/context';

import useIsMobile from 'client/shared/hooks/useIsMobile';
import DataList from 'client/shared/lists/DataList';
import Pagination from 'client/shared/pagination/Pagination';

import { FilterInput } from 'toolkit/components/filters/FilterInput';
import ActionBar from 'ui/shared/ActionBar';

const MultichainInternalTxs = () => {
  const isMobile = useIsMobile();

  const { query, searchTerm, onSearchTermChange } = useInternalTxsQuery({ isMultichain: true });
  const { isError, isPlaceholderData, data, pagination } = query;

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
      value={ query.chainValue }
      onValueChange={ query.onChainValueChange }
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
    <MultichainProvider chainId={ query.chainValue?.[0] }>
      <Box hideBelow="lg">
        <InternalTxsTable data={ data.items } isLoading={ isPlaceholderData }/>
      </Box>
      <Box hideFrom="lg">
        <InternalTxsList data={ data.items } isLoading={ isPlaceholderData }/>
      </Box>
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
      >
        { content }
      </DataList>
    </>
  );
};

export default React.memo(MultichainInternalTxs);

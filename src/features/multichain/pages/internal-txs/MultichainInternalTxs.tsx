// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import ActionBar from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import InternalTxsList from 'src/slices/internal-tx/components/InternalTxsList';
import InternalTxsTable from 'src/slices/internal-tx/components/InternalTxsTable';
import useInternalTxsQuery from 'src/slices/internal-tx/hooks/useInternalTxsQuery';

import ChainSelect from 'src/features/multichain/components/ChainSelect';
import { MultichainProvider } from 'src/features/multichain/context';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';

import { FilterInput } from 'src/toolkit/components/filters/FilterInput';

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

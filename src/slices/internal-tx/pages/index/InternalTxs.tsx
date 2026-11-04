// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import ActionBar from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import InternalTxsTable from 'src/slices/internal-tx/components/InternalTxsTable';
import InternalTxsZeroValueSwitch from 'src/slices/internal-tx/components/InternalTxsZeroValueSwitch';
import useInternalTxsQuery from 'src/slices/internal-tx/hooks/useInternalTxsQuery';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';
import { FilterInput } from 'src/toolkit/components/filters/FilterInput';

const InternalTxs = () => {
  const isMobile = useIsMobile();
  const { query, searchTerm, onSearchTermChange } = useInternalTxsQuery();
  const { isError, isInitialLoading, isTransitioning, data, pagination, isZeroValueShown, onZeroValueToggle } = query;

  const filterInput = (
    <FilterInput
      w={{ base: '100%', lg: '350px' }}
      size="sm"
      onChange={ onSearchTermChange }
      placeholder="Search by transaction hash"
      initialValue={ searchTerm }
    />
  );

  const zeroValueSwitch = (
    <InternalTxsZeroValueSwitch
      isChecked={ isZeroValueShown }
      onChange={ onZeroValueToggle }
      isLoading={ pagination.isLoading }
    />
  );

  const actionBar = (
    <>
      <Box mb={ 6 } display={{ base: 'flex', lg: 'none' }}>
        { filterInput }
      </Box>
      <ActionBar mt={ -6 }>
        <Flex columnGap={ 6 } alignItems="center">
          { !isMobile && filterInput }
          { zeroValueSwitch }
        </Flex>
        <Pagination ml="auto" { ...pagination }/>
      </ActionBar>
    </>
  );

  const content = data?.items ? (
    <TableContainerScrollable>
      <InternalTxsTable data={ data.items } isLoading={ isInitialLoading } resetKey={ query.queryHash }/>
    </TableContainerScrollable>
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
        isTransitioning={ isTransitioning }
        emptyStateProps={{
          term: 'internal transaction',
        }}
        actionBar={ actionBar }
        showActionBarIfEmpty
        showActionBarIfError
      >
        { content }
      </DataList>
    </>
  );
};

export default InternalTxs;

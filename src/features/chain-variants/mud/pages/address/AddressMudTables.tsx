// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import { ADDRESS_MUD_TABLE_ITEM } from 'src/features/chain-variants/mud/stubs/address';

import useDebounce from 'src/shared/hooks/useDebounce';
import useIsInitialLoading from 'src/shared/hooks/useIsInitialLoading';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import { FilterInput } from 'src/toolkit/components/filters/FilterInput';

import AddressMudTablesListItem from './AddressMudTablesListItem';
import AddressMudTablesTable from './AddressMudTablesTable';

type Props = {
  isQueryEnabled?: boolean;
};

const AddressMudTables = ({ isQueryEnabled = true }: Props) => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);
  const q = getQueryParamString(router.query.q);
  const [ searchTerm, setSearchTerm ] = React.useState<string>(q || '');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data, isPlaceholderData, isError, pagination } = useQueryWithPages({
    resourceName: 'core:mud_tables',
    pathParams: { hash },
    filters: { q: debouncedSearchTerm },
    options: {
      enabled: isQueryEnabled,
      placeholderData: generateListStub<'core:mud_tables'>(ADDRESS_MUD_TABLE_ITEM, 3, { next_page_params: {
        items_count: 50,
        table_id: '1',
      } }),
    },
  });

  const isInitialLoading = useIsInitialLoading(isPlaceholderData);

  const searchInput = (
    <FilterInput
      w={{ base: '100%', lg: '360px' }}
      minW={{ base: 'auto', lg: '250px' }}
      size="sm"
      onChange={ setSearchTerm }
      placeholder="Search by name, namespace or table ID..."
      initialValue={ searchTerm }
      loading={ isInitialLoading }
    />
  );

  const actionBar = (
    <ActionBar mt={ -6 } showShadow justifyContent="space-between">
      { searchInput }
      <Pagination ml={{ base: 0, lg: 8 }} { ...pagination }/>
    </ActionBar>
  );

  const content = data?.items ? (
    <>
      <Box hideBelow="lg">
        <AddressMudTablesTable
          items={ data.items }
          isLoading={ isPlaceholderData }
          top={ ACTION_BAR_HEIGHT_DESKTOP }
          hash={ hash }
        />
      </Box>
      <Box hideFrom="lg">
        { data.items.map((item, index) => (
          <AddressMudTablesListItem
            key={ item.table.table_id + (isPlaceholderData ? String(index) : '') }
            item={ item }
            isLoading={ isPlaceholderData }
            hash={ hash }
          />
        )) }
      </Box>
    </>
  ) : null;

  return (
    <DataList
      isError={ isError }
      itemsNum={ data?.items?.length }
      emptyText="There are no tables for this address."
      hasActiveFilters={ Boolean(debouncedSearchTerm) }
      emptyStateProps={{
        term: 'table',
      }}
      actionBar={ actionBar }
    >
      { content }
    </DataList>
  );
};

export default AddressMudTables;

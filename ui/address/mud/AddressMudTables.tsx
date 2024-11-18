import { Hide, Show } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useDebounce from 'lib/hooks/useDebounce';
import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import { apos } from 'lib/html-entities';
import getQueryParamString from 'lib/router/getQueryParamString';
import { ADDRESS_MUD_TABLE_ITEM } from 'stubs/address';
import { generateListStub } from 'stubs/utils';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import FilterInput from 'ui/shared/filters/FilterInput';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import AddressMudTablesListItem from './AddressMudTablesListItem';
import AddressMudTablesTable from './AddressMudTablesTable';

type Props = {
  scrollRef?: React.RefObject<HTMLDivElement>;
  isQueryEnabled?: boolean;
};

const AddressMudTables = ({ scrollRef, isQueryEnabled = true }: Props) => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);
  const q = getQueryParamString(router.query.q);
  const [ searchTerm, setSearchTerm ] = React.useState<string>(q || '');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data, isPlaceholderData, isError, pagination } = useQueryWithPages({
    resourceName: 'address_mud_tables',
    pathParams: { hash },
    filters: { q: debouncedSearchTerm },
    scrollRef,
    options: {
      enabled: isQueryEnabled,
      placeholderData: generateListStub<'address_mud_tables'>(ADDRESS_MUD_TABLE_ITEM, 3, { next_page_params: {
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
      size="xs"
      onChange={ setSearchTerm }
      placeholder="Search by name, namespace or table ID..."
      initialValue={ searchTerm }
      isLoading={ isInitialLoading }
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
      <Hide below="lg" ssr={ false }>
        <AddressMudTablesTable
          items={ data.items }
          isLoading={ isPlaceholderData }
          top={ ACTION_BAR_HEIGHT_DESKTOP }
          scrollRef={ scrollRef }
          hash={ hash }
        />
      </Hide>
      <Show below="lg" ssr={ false }>
        { data.items.map((item, index) => (
          <AddressMudTablesListItem
            key={ item.table.table_id + (isPlaceholderData ? String(index) : '') }
            item={ item }
            isLoading={ isPlaceholderData }
            hash={ hash }
          />
        )) }
      </Show>
    </>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      items={ data?.items }
      emptyText="There are no tables for this address."
      filterProps={{
        emptyFilteredText: `Couldn${ apos }t find tables that match your filter query.`,
        hasActiveFilters: Boolean(searchTerm),
      }}
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default AddressMudTables;

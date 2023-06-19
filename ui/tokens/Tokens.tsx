import { Hide, HStack, Show } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import type { TokenType } from 'types/api/token';

import getFilterValuesFromQuery from 'lib/getFilterValuesFromQuery';
import useDebounce from 'lib/hooks/useDebounce';
import { apos } from 'lib/html-entities';
import TOKEN_TYPE from 'lib/token/tokenTypes';
import { TOKEN_INFO_ERC_20 } from 'stubs/token';
import { generateListStub } from 'stubs/utils';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DataListDisplay from 'ui/shared/DataListDisplay';
import FilterInput from 'ui/shared/filters/FilterInput';
import PopoverFilter from 'ui/shared/filters/PopoverFilter';
import TokenTypeFilter from 'ui/shared/filters/TokenTypeFilter';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import TokensListItem from './TokensListItem';
import TokensTable from './TokensTable';

const TOKEN_TYPES = TOKEN_TYPE.map(i => i.id);
const getTokenFilterValue = (getFilterValuesFromQuery<TokenType>).bind(null, TOKEN_TYPES);

const Tokens = () => {
  const router = useRouter();
  const [ filter, setFilter ] = React.useState<string>(router.query.q?.toString() || '');
  const [ type, setType ] = React.useState<Array<TokenType> | undefined>(getTokenFilterValue(router.query.type));

  const debouncedFilter = useDebounce(filter, 300);

  const { isError, isPlaceholderData, data, pagination, onFilterChange } = useQueryWithPages({
    resourceName: 'tokens',
    filters: { q: debouncedFilter, type },
    options: {
      placeholderData: generateListStub<'tokens'>(
        TOKEN_INFO_ERC_20,
        50,
        {
          next_page_params: {
            holder_count: 81528,
            items_count: 50,
            name: '',
            market_cap: null,
          },
        },
      ),
    },
  });

  const onSearchChange = useCallback((value: string) => {
    onFilterChange({ q: value, type });
    setFilter(value);
  }, [ type, onFilterChange ]);

  const onTypeChange = useCallback((value: Array<TokenType>) => {
    onFilterChange({ q: debouncedFilter, type: value });
    setType(value);
  }, [ debouncedFilter, onFilterChange ]);

  if (isError) {
    return <DataFetchAlert/>;
  }

  const typeFilter = (
    <PopoverFilter isActive={ type && type.length > 0 } contentProps={{ w: '200px' }}>
      <TokenTypeFilter onChange={ onTypeChange } defaultValue={ type }/>
    </PopoverFilter>
  );

  const filterInput = (
    <FilterInput
      w="100%"
      size="xs"
      onChange={ onSearchChange }
      placeholder="Token name or symbol"
      initialValue={ filter }
    />
  );

  const actionBar = (
    <>
      <HStack spacing={ 3 } mb={ 6 } display={{ base: 'flex', lg: 'none' }}>
        { typeFilter }
        { filterInput }
      </HStack>
      <ActionBar mt={ -6 }>
        <HStack spacing={ 3 } display={{ base: 'none', lg: 'flex' }}>
          { typeFilter }
          { filterInput }
        </HStack>
        <Pagination ml="auto" { ...pagination }/>
      </ActionBar>
    </>
  );

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>
        { data.items.map((item, index) => (
          <TokensListItem
            key={ item.address + (isPlaceholderData ? index : '') }
            token={ item }
            index={ index }
            page={ pagination.page }
            isLoading={ isPlaceholderData }
          />
        )) }
      </Show>
      <Hide below="lg" ssr={ false }><TokensTable items={ data.items } page={ pagination.page } isLoading={ isPlaceholderData }/></Hide></>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      items={ data?.items }
      emptyText="There are no tokens."
      filterProps={{
        emptyFilteredText: `Couldn${ apos }t find token that matches your filter query.`,
        hasActiveFilters: Boolean(debouncedFilter || type),
      }}
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default Tokens;

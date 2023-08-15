import { Hide, HStack, Show } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import type { TokenType } from 'types/api/token';
import type { TokensSorting } from 'types/api/tokens';

import type { Query } from 'nextjs-routes';

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
import type { Option } from 'ui/shared/sort/Sort';
import Sort from 'ui/shared/sort/Sort';

import TokensListItem from './TokensListItem';
import TokensTable from './TokensTable';

const TOKEN_TYPES = TOKEN_TYPE.map(i => i.id);
const getTokenFilterValue = (getFilterValuesFromQuery<TokenType>).bind(null, TOKEN_TYPES);

export type TokensSortingField = TokensSorting['sort'];
export type TokensSortingValue = `${ TokensSortingField }-${ TokensSorting['order'] }`;

const SORT_OPTIONS: Array<Option<TokensSortingValue>> = [
  { title: 'Default', id: undefined },
  { title: 'Price ascending', id: 'fiat_value-asc' },
  { title: 'Price descending', id: 'fiat_value-desc' },
  { title: 'Holders ascending', id: 'holder_count-asc' },
  { title: 'Holders descending', id: 'holder_count-desc' },
  { title: 'On-chain market cap ascending', id: 'circulating_market_cap-asc' },
  { title: 'On-chain market cap descending', id: 'circulating_market_cap-desc' },
];

const getSortValueFromQuery = (query: Query): TokensSortingValue | undefined => {
  if (!query.sort || !query.order) {
    return undefined;
  }

  const str = query.sort + '-' + query.order;
  if (SORT_OPTIONS.map(option => option.id).includes(str)) {
    return str as TokensSortingValue;
  }
};

const getSortParamsFromValue = (val?: TokensSortingValue): TokensSorting | undefined => {
  if (!val) {
    return undefined;
  }
  const sortingChunks = val.split('-') as [ TokensSortingField, TokensSorting['order'] ];
  return { sort: sortingChunks[0], order: sortingChunks[1] };
};

const Tokens = () => {
  const router = useRouter();
  const [ filter, setFilter ] = React.useState<string>(router.query.q?.toString() || '');
  const [ sorting, setSorting ] = React.useState<TokensSortingValue | undefined>(getSortValueFromQuery(router.query));
  const [ type, setType ] = React.useState<Array<TokenType> | undefined>(getTokenFilterValue(router.query.type));

  const debouncedFilter = useDebounce(filter, 300);

  const { isError, isPlaceholderData, data, pagination, onFilterChange, onSortingChange } = useQueryWithPages({
    resourceName: 'tokens',
    filters: { q: debouncedFilter, type },
    sorting: getSortParamsFromValue(sorting),
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

  const onSort = useCallback((value?: TokensSortingValue) => {
    setSorting(value);
    onSortingChange(getSortParamsFromValue(value));
  }, [ setSorting, onSortingChange ]);

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
        <Sort
          options={ SORT_OPTIONS }
          setSort={ onSort }
          sort={ sorting }
        />
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
      <Hide below="lg" ssr={ false }>
        <TokensTable
          items={ data.items }
          page={ pagination.page }
          isLoading={ isPlaceholderData }
          setSorting={ onSort }
          sorting={ sorting }
        />
      </Hide>
    </>
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

import { Hide, HStack, Show, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import type { TokenType } from 'types/api/token';

import getFilterValuesFromQuery from 'lib/getFilterValuesFromQuery';
import useDebounce from 'lib/hooks/useDebounce';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import { apos } from 'lib/html-entities';
import TOKEN_TYPE from 'lib/token/tokenTypes';
import EmptySearchResult from 'ui/apps/EmptySearchResult';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import FilterInput from 'ui/shared/filters/FilterInput';
import PopoverFilter from 'ui/shared/filters/PopoverFilter';
import TokenTypeFilter from 'ui/shared/filters/TokenTypeFilter';
import Pagination from 'ui/shared/Pagination';
import SkeletonList from 'ui/shared/skeletons/SkeletonList';
import SkeletonTable from 'ui/shared/skeletons/SkeletonTable';

import TokensListItem from './TokensListItem';
import TokensTable from './TokensTable';

const TOKEN_TYPES = TOKEN_TYPE.map(i => i.id);
const getTokenFilterValue = (getFilterValuesFromQuery<TokenType>).bind(null, TOKEN_TYPES);

const Tokens = () => {
  const router = useRouter();
  const [ filter, setFilter ] = React.useState<string>(router.query.filter?.toString() || '');
  const [ type, setType ] = React.useState<Array<TokenType> | undefined>(getTokenFilterValue(router.query.type));

  const debouncedFilter = useDebounce(filter, 300);

  const { isError, isLoading, data, isPaginationVisible, pagination, onFilterChange } = useQueryWithPages({
    resourceName: 'tokens',
    filters: { filter: debouncedFilter, type },
  });

  const onSearchChange = useCallback((value: string) => {
    onFilterChange({ filter: value, type });
    setFilter(value);
  }, [ type, onFilterChange ]);

  const onTypeChange = useCallback((value: Array<TokenType>) => {
    onFilterChange({ filter: debouncedFilter, type: value });
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

  const bar = (
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
        { isPaginationVisible && <Pagination ml="auto" { ...pagination }/> }
      </ActionBar>
    </>
  );

  if (isLoading) {
    return (
      <>
        { bar }
        <SkeletonList display={{ base: 'block', lg: 'none' }}/>
        <SkeletonTable display={{ base: 'none', lg: 'block' }} columns={ [ '25px', '33%', '33%', '33%', '110px' ] }/>
      </>
    );
  }

  if (!data.items.length) {
    if (debouncedFilter) {
      return (
        <>
          { bar }
          <EmptySearchResult text={ `Couldn${ apos }t find token that matches your filter query.` }/>;
        </>
      );
    }
    return <Text as="span">There are no tokens</Text>;
  }

  return (
    <>
      { bar }
      <Show below="lg" ssr={ false }>
        { data.items.map((item, index) => <TokensListItem key={ item.address } token={ item } index={ index } page={ pagination.page }/>) }
      </Show>
      <Hide below="lg" ssr={ false }><TokensTable items={ data.items } page={ pagination.page }/></Hide>
    </>
  );
};

export default Tokens;

import { Hide, Show, Text } from '@chakra-ui/react';
import React from 'react';

import useDebounce from 'lib/hooks/useDebounce';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import { apos } from 'lib/html-entities';
import EmptySearchResult from 'ui/apps/EmptySearchResult';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import FilterInput from 'ui/shared/FilterInput';
import Pagination from 'ui/shared/Pagination';
import SkeletonList from 'ui/shared/skeletons/SkeletonList';
import SkeletonTable from 'ui/shared/skeletons/SkeletonTable';

import TokensListItem from './TokensListItem';
import TokensTable from './TokensTable';

const Tokens = () => {
  const [ filter, setFilter ] = React.useState<string>('');

  const debouncedFilter = useDebounce(filter, 300);

  const { isError, isLoading, data, isPaginationVisible, pagination } = useQueryWithPages({
    resourceName: 'tokens',
    filters: { filter: debouncedFilter },
  });

  if (isError) {
    return <DataFetchAlert/>;
  }

  const bar = (
    <>
      <Show below="lg">
        <FilterInput
          w="100%"
          size="xs"
          onChange={ setFilter }
          placeholder="Token name or symbol"
          mb={ 6 }
        />
      </Show>
      <ActionBar mt={ -6 } flexDirection={{ base: 'column', lg: 'row' }} rowGap={ 6 }>
        <Hide below="lg">
          <FilterInput
            w="362px"
            size="xs"
            onChange={ setFilter }
            placeholder="Token name or symbol"
          />
        </Hide>
        { isPaginationVisible && <Pagination ml="auto" { ...pagination }/> }
      </ActionBar>
    </>
  );

  if (isLoading) {
    return (
      <>
        { bar }
        <Show below="lg"><SkeletonList/></Show>
        <Hide below="lg">
          <SkeletonTable columns={ [ '25px', '33%', '33%', '33%', '110px' ] }/>
        </Hide>
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

import { Box, chakra, Table, Tbody, Tr, Th, Skeleton, Show, Hide } from '@chakra-ui/react';
import type { FormEvent } from 'react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import link from 'lib/link/link';
import SearchResultListItem from 'ui/searchResults/SearchResultListItem';
import SearchResultTableItem from 'ui/searchResults/SearchResultTableItem';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/Pagination';
import SkeletonList from 'ui/shared/skeletons/SkeletonList';
import SkeletonTable from 'ui/shared/skeletons/SkeletonTable';
import { default as Thead } from 'ui/shared/TheadSticky';
import Header from 'ui/snippets/header/Header';
import SearchBarInput from 'ui/snippets/searchBar/SearchBarInput';
import useSearchQuery from 'ui/snippets/searchBar/useSearchQuery';

const SearchResultsPageContent = () => {
  const { query, searchTerm, handleSearchTermChange } = useSearchQuery(true);
  const { data, isError, isLoading, pagination, isPaginationVisible } = query;
  const isMobile = useIsMobile();

  const handleSubmit = React.useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm) {
      const url = link('search_results', undefined, { q: searchTerm });
      window.location.assign(url);
    }
  }, [ searchTerm ]);

  const content = (() => {
    if (isError) {
      return <DataFetchAlert/>;
    }

    if (isLoading) {
      return (
        <Box>
          <Skeleton h={ 6 } w="280px" borderRadius="full" mb={ 6 }/>
          <Show below="lg" ssr={ false }>
            <SkeletonList/>
          </Show>
          <Hide below="lg" ssr={ false }>
            <SkeletonTable columns={ [ '33%', '34%', '33%' ] }/>
          </Hide>
        </Box>
      );
    }

    const num = pagination.page > 1 ? 50 : data.items.length;
    const text = (
      <Box mb={ isPaginationVisible ? 0 : 6 } lineHeight="32px">
        <span>Found </span>
        <chakra.span fontWeight={ 700 }>{ num }{ data.next_page_params || pagination.page > 1 ? '+' : '' }</chakra.span>
        <span> matching results for </span>
                “<chakra.span fontWeight={ 700 }>{ searchTerm }</chakra.span>”
      </Box>
    );

    const bar = (() => {
      if (!isPaginationVisible) {
        return text;
      }

      if (isMobile) {
        return (
          <>
            { text }
            <ActionBar>
              <Pagination { ...pagination } ml="auto"/>
            </ActionBar>
          </>
        );
      }

      return (
        <ActionBar mt={ -6 }>
          { text }
          <Pagination { ...pagination }/>
        </ActionBar>
      );
    })();

    return (
      <>
        { bar }
        { data.items.length > 0 && (
          <>
            <Show below="lg" ssr={ false }>
              { data.items.map((item, index) => <SearchResultListItem key={ index } data={ item }/>) }
            </Show>
            <Hide below="lg" ssr={ false }>
              <Table variant="simple" size="md" fontWeight={ 500 }>
                <Thead top={ isPaginationVisible ? 80 : 0 }>
                  <Tr>
                    <Th width="50%">Search Result</Th>
                    <Th width="50%"/>
                    <Th width="150px">Category</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  { data.items.map((item, index) => <SearchResultTableItem key={ index } data={ item }/>) }
                </Tbody>
              </Table>
            </Hide>
          </>
        ) }
      </>
    );
  })();

  const renderSearchBar = React.useCallback(() => {
    return (
      <SearchBarInput
        onChange={ handleSearchTermChange }
        onSubmit={ handleSubmit }
        value={ searchTerm }
      />
    );
  }, [ handleSearchTermChange, handleSubmit, searchTerm ]);

  const renderHeader = React.useCallback(() => {
    return <Header renderSearchBar={ renderSearchBar }/>;
  }, [ renderSearchBar ]);

  return (
    <Page renderHeader={ renderHeader }>
      <PageTitle text="Search results"/>
      { content }
    </Page>
  );
};

export default SearchResultsPageContent;

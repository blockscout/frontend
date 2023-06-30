import { Box, chakra, Table, Tbody, Tr, Th, Skeleton, Show, Hide } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import type { FormEvent } from 'react';
import React from 'react';

import SearchResultListItem from 'ui/searchResults/SearchResultListItem';
import SearchResultsInput from 'ui/searchResults/SearchResultsInput';
import SearchResultTableItem from 'ui/searchResults/SearchResultTableItem';
import ActionBar from 'ui/shared/ActionBar';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import Thead from 'ui/shared/TheadSticky';
import Header from 'ui/snippets/header/Header';
import useSearchQuery from 'ui/snippets/searchBar/useSearchQuery';

const SearchResultsPageContent = () => {
  const router = useRouter();
  const { query, redirectCheckQuery, searchTerm, debouncedSearchTerm, handleSearchTermChange } = useSearchQuery(true);
  const { data, isError, isPlaceholderData, pagination } = query;
  const [ showContent, setShowContent ] = React.useState(false);

  React.useEffect(() => {
    if (showContent) {
      return;
    }

    if (!debouncedSearchTerm) {
      setShowContent(true);
      return;
    }

    if (redirectCheckQuery.data?.redirect && redirectCheckQuery.data.parameter) {
      switch (redirectCheckQuery.data.type) {
        case 'block': {
          router.push({ pathname: '/block/[height_or_hash]', query: { height_or_hash: redirectCheckQuery.data.parameter } });
          return;
        }
        case 'address': {
          router.push({ pathname: '/address/[hash]', query: { hash: redirectCheckQuery.data.parameter } });
          return;
        }
        case 'transaction': {
          router.push({ pathname: '/tx/[hash]', query: { hash: redirectCheckQuery.data.parameter } });
          return;
        }
      }
    }

    !redirectCheckQuery.isLoading && setShowContent(true);
  }, [ redirectCheckQuery, router, debouncedSearchTerm, showContent ]);

  const handleSubmit = React.useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, [ ]);

  const content = (() => {
    if (isError) {
      return <DataFetchAlert/>;
    }

    if (!data?.items.length) {
      return null;
    }

    return (
      <>
        <Show below="lg" ssr={ false }>
          { data.items.map((item, index) => (
            <SearchResultListItem
              key={ (isPlaceholderData ? 'placeholder_' : 'actual_') + index }
              data={ item }
              searchTerm={ debouncedSearchTerm }
              isLoading={ isPlaceholderData }
            />
          )) }
        </Show>
        <Hide below="lg" ssr={ false }>
          <Table variant="simple" size="md" fontWeight={ 500 }>
            <Thead top={ pagination.isVisible ? 80 : 0 }>
              <Tr>
                <Th width="50%">Search Result</Th>
                <Th width="50%"/>
                <Th width="150px">Category</Th>
              </Tr>
            </Thead>
            <Tbody>
              { data.items.map((item, index) => (
                <SearchResultTableItem
                  key={ (isPlaceholderData ? 'placeholder_' : 'actual_') + index }
                  data={ item }
                  searchTerm={ debouncedSearchTerm }
                  isLoading={ isPlaceholderData }
                />
              )) }
            </Tbody>
          </Table>
        </Hide>
      </>
    );
  })();

  const bar = (() => {
    if (isError) {
      return null;
    }

    const text = isPlaceholderData && pagination.page === 1 ? (
      <Skeleton h={ 6 } w="280px" borderRadius="full" mb={ pagination.isVisible ? 0 : 6 }/>
    ) : (
      (
        <Box mb={ pagination.isVisible ? 0 : 6 } lineHeight="32px">
          <span>Found </span>
          <chakra.span fontWeight={ 700 }>
            { pagination.page > 1 ? 50 : data?.items.length }{ data?.next_page_params || pagination.page > 1 ? '+' : '' }
          </chakra.span>
          <span> matching result{ (data?.items && data.items.length > 1) || pagination.page > 1 ? 's' : '' } for </span>
                      “<chakra.span fontWeight={ 700 }>{ debouncedSearchTerm }</chakra.span>”
        </Box>
      )
    );

    if (!pagination.isVisible) {
      return text;
    }

    return (
      <>
        <Box display={{ base: 'block', lg: 'none' }}>{ text }</Box>
        <ActionBar mt={{ base: 0, lg: -6 }} alignItems="center">
          <Box display={{ base: 'none', lg: 'block' }}>{ text }</Box>
          <Pagination { ...pagination }/>
        </ActionBar>
      </>
    );
  })();

  const renderSearchBar = React.useCallback(() => {
    return (
      <SearchResultsInput
        searchTerm={ searchTerm }
        handleSubmit={ handleSubmit }
        handleSearchTermChange={ handleSearchTermChange }
      />
    );
  }, [ handleSearchTermChange, handleSubmit, searchTerm ]);

  const renderHeader = React.useCallback(() => {
    return <Header renderSearchBar={ renderSearchBar }/>;
  }, [ renderSearchBar ]);

  const pageContent = !showContent ? <ContentLoader/> : (
    <>
      <PageTitle title="Search results"/>
      { bar }
      { content }
    </>
  );

  return (
    <Page renderHeader={ renderHeader }>
      { pageContent }
    </Page>
  );
};

export default React.memo(SearchResultsPageContent);

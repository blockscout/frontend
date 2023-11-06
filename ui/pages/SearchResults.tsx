import { Box, chakra, Table, Tbody, Tr, Th, Skeleton, Show, Hide } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import type { FormEvent } from 'react';
import React from 'react';

import useMarketplaceApps from 'ui/marketplace/useMarketplaceApps';
import SearchResultListItem from 'ui/searchResults/SearchResultListItem';
import SearchResultsInput from 'ui/searchResults/SearchResultsInput';
import SearchResultTableItem from 'ui/searchResults/SearchResultTableItem';
import ActionBar from 'ui/shared/ActionBar';
import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import * as Layout from 'ui/shared/layout/components';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import Thead from 'ui/shared/TheadSticky';
import Header from 'ui/snippets/header/Header';
import HeaderAlert from 'ui/snippets/header/HeaderAlert';
import useSearchQuery from 'ui/snippets/searchBar/useSearchQuery';

const SearchResultsPageContent = () => {
  const router = useRouter();
  const { query, redirectCheckQuery, searchTerm, debouncedSearchTerm, handleSearchTermChange } = useSearchQuery();
  const { data, isError, isPlaceholderData, pagination } = query;
  const [ showContent, setShowContent ] = React.useState(false);

  const marketplaceApps = useMarketplaceApps(debouncedSearchTerm);

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
          router.replace({ pathname: '/block/[height_or_hash]', query: { height_or_hash: redirectCheckQuery.data.parameter } });
          return;
        }
        case 'address': {
          router.replace({ pathname: '/address/[hash]', query: { hash: redirectCheckQuery.data.parameter } });
          return;
        }
        case 'transaction': {
          router.replace({ pathname: '/tx/[hash]', query: { hash: redirectCheckQuery.data.parameter } });
          return;
        }
      }
    }

    !redirectCheckQuery.isPending && setShowContent(true);
  }, [ redirectCheckQuery, router, debouncedSearchTerm, showContent ]);

  const handleSubmit = React.useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, [ ]);

  const content = (() => {
    if (isError) {
      return <DataFetchAlert/>;
    }

    const hasData = data?.items.length || (pagination.page === 1 && marketplaceApps.displayedApps.length);

    if (!hasData) {
      return null;
    }

    return (
      <>
        <Show below="lg" ssr={ false }>
          { pagination.page === 1 && marketplaceApps.displayedApps.map((item, index) => (
            <SearchResultListItem
              key={ 'actual_' + index }
              data={{ type: 'app', app: item }}
              searchTerm={ debouncedSearchTerm }
            />
          )) }
          { data && data.items.map((item, index) => (
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
                <Th width="30%">Search result</Th>
                <Th width="35%"/>
                <Th width="35%" pr={ 10 }/>
                <Th width="150px">Category</Th>
              </Tr>
            </Thead>
            <Tbody>
              { pagination.page === 1 && marketplaceApps.displayedApps.map((item, index) => (
                <SearchResultTableItem
                  key={ 'actual_' + index }
                  data={{ type: 'app', app: item }}
                  searchTerm={ debouncedSearchTerm }
                />
              )) }
              { data && data.items.map((item, index) => (
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

    const resultsCount = pagination.page === 1 && !data?.next_page_params ? (data?.items.length || 0) + marketplaceApps.displayedApps.length : '50+';

    const text = isPlaceholderData && pagination.page === 1 ? (
      <Skeleton h={ 6 } w="280px" borderRadius="full" mb={ pagination.isVisible ? 0 : 6 }/>
    ) : (
      (
        <Box mb={ pagination.isVisible ? 0 : 6 } lineHeight="32px">
          <span>Found </span>
          <chakra.span fontWeight={ 700 }>
            { resultsCount }
          </chakra.span>
          <span> matching result{ (((data?.items.length || 0) + marketplaceApps.displayedApps.length) > 1) || pagination.page > 1 ? 's' : '' } for </span>
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

  const pageContent = !showContent ? <ContentLoader/> : (
    <>
      <PageTitle title="Search results"/>
      { bar }
      { content }
    </>
  );

  return (
    <>
      <HeaderAlert/>
      <Header renderSearchBar={ renderSearchBar }/>
      <AppErrorBoundary>
        <Layout.Content>
          { pageContent }
        </Layout.Content>
      </AppErrorBoundary>
    </>
  );
};

export default React.memo(SearchResultsPageContent);

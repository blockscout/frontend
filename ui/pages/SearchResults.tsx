import { Box, chakra, Table, Tbody, Tr, Th, Skeleton, Show, Hide } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import type { FormEvent } from 'react';
import React from 'react';

import type { SearchResultItem } from 'types/client/search';

import config from 'configs/app';
import * as regexp from 'lib/regexp';
import getQueryParamString from 'lib/router/getQueryParamString';
import removeQueryParam from 'lib/router/removeQueryParam';
import useMarketplaceApps from 'ui/marketplace/useMarketplaceApps';
import SearchResultListItem from 'ui/searchResults/SearchResultListItem';
import SearchResultsInput from 'ui/searchResults/SearchResultsInput';
import SearchResultTableItem from 'ui/searchResults/SearchResultTableItem';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import * as Layout from 'ui/shared/layout/components';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import type { SearchResultAppItem } from 'ui/shared/search/utils';
import Thead from 'ui/shared/TheadSticky';
import HeaderAlert from 'ui/snippets/header/HeaderAlert';
import HeaderDesktop from 'ui/snippets/header/HeaderDesktop';
import HeaderMobile from 'ui/snippets/header/HeaderMobile';
import SearchBarSuggestBlockCountdown from 'ui/snippets/searchBar/SearchBarSuggest/SearchBarSuggestBlockCountdown';
import useSearchQuery from 'ui/snippets/searchBar/useSearchQuery';

const SearchResultsPageContent = () => {
  const router = useRouter();
  const withRedirectCheck = getQueryParamString(router.query.redirect) === 'true';
  const { query, redirectCheckQuery, searchTerm, debouncedSearchTerm, handleSearchTermChange } = useSearchQuery(withRedirectCheck);
  const { data, isError, isPlaceholderData, pagination } = query;
  const [ showContent, setShowContent ] = React.useState(!withRedirectCheck);

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
        case 'user_operation': {
          if (config.features.userOps.isEnabled) {
            router.replace({ pathname: '/op/[hash]', query: { hash: redirectCheckQuery.data.parameter } });
            return;
          }
          break;
        }
        case 'blob': {
          if (config.features.dataAvailability.isEnabled) {
            router.replace({ pathname: '/blobs/[hash]', query: { hash: redirectCheckQuery.data.parameter } });
            return;
          }
          break;
        }
      }
    }

    if (!redirectCheckQuery.isPending) {
      setShowContent(true);
      removeQueryParam(router, 'redirect');
    }
  }, [ redirectCheckQuery, router, debouncedSearchTerm, showContent ]);

  const handleSubmit = React.useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, [ ]);

  const isLoading = marketplaceApps.isPlaceholderData || isPlaceholderData;

  const displayedItems: Array<SearchResultItem | SearchResultAppItem> = React.useMemo(() => {
    const apiData = (data?.items || []).filter((item) => {
      if (!config.features.userOps.isEnabled && item.type === 'user_operation') {
        return false;
      }
      if (!config.features.dataAvailability.isEnabled && item.type === 'blob') {
        return false;
      }
      if (!config.features.nameService.isEnabled && item.type === 'ens_domain') {
        return false;
      }
      return true;
    });

    const futureBlockItem = !isPlaceholderData &&
      pagination.page === 1 &&
      !data?.next_page_params &&
      apiData.length > 0 &&
      !apiData.some(({ type }) => type === 'block') &&
      regexp.BLOCK_HEIGHT.test(debouncedSearchTerm) ?
      {
        type: 'block' as const,
        block_type: 'block' as const,
        block_number: debouncedSearchTerm,
        block_hash: '',
        timestamp: undefined,
      } : undefined;

    return [
      ...(pagination.page === 1 && !isLoading ? marketplaceApps.displayedApps.map((item) => ({ type: 'app' as const, app: item })) : []),
      futureBlockItem,
      ...apiData,
    ].filter(Boolean);

  }, [ data?.items, data?.next_page_params, isPlaceholderData, pagination.page, debouncedSearchTerm, marketplaceApps.displayedApps, isLoading ]);

  const content = (() => {
    if (isError) {
      return <DataFetchAlert/>;
    }

    if (!displayedItems.length) {
      return null;
    }

    return (
      <>
        <Show below="lg" ssr={ false }>
          { displayedItems.map((item, index) => (
            <SearchResultListItem
              key={ (isLoading ? 'placeholder_' : 'actual_') + index }
              data={ item }
              searchTerm={ debouncedSearchTerm }
              isLoading={ isLoading }
            />
          )) }
        </Show>
        <Hide below="lg" ssr={ false }>
          <Table variant="simple" size="md" fontWeight={ 500 }>
            <Thead top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }>
              <Tr>
                <Th width="30%">Search result</Th>
                <Th width="35%"/>
                <Th width="35%" pr={ 10 }/>
                <Th width="150px">Category</Th>
              </Tr>
            </Thead>
            <Tbody>
              { displayedItems.map((item, index) => (
                <SearchResultTableItem
                  key={ (isLoading ? 'placeholder_' : 'actual_') + index }
                  data={ item }
                  searchTerm={ debouncedSearchTerm }
                  isLoading={ isLoading }
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

    const resultsCount = pagination.page === 1 && !data?.next_page_params ? displayedItems.length : '50+';

    const text = isLoading && pagination.page === 1 ? (
      <Skeleton h={ 6 } w="280px" borderRadius="full" mb={ pagination.isVisible ? 0 : 6 }/>
    ) : (
      (
        <>
          <Box mb={ pagination.isVisible ? 0 : 6 } lineHeight="32px">
            <span>Found </span>
            <chakra.span fontWeight={ 700 }>
              { resultsCount }
            </chakra.span>
            <span> matching result{ (((displayedItems.length || 0) + marketplaceApps.displayedApps.length) > 1) || pagination.page > 1 ? 's' : '' } for </span>
            “<chakra.span fontWeight={ 700 }>{ debouncedSearchTerm }</chakra.span>”
          </Box>
          { resultsCount === 0 && regexp.BLOCK_HEIGHT.test(debouncedSearchTerm) &&
            <SearchBarSuggestBlockCountdown blockHeight={ debouncedSearchTerm } mt={ -4 }/> }
        </>
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
      <HeaderMobile renderSearchBar={ renderSearchBar }/>
      <Layout.MainArea>
        <Layout.SideBar/>
        <Layout.MainColumn>
          <HeaderAlert/>
          <HeaderDesktop renderSearchBar={ renderSearchBar }/>
          <AppErrorBoundary>
            <Layout.Content flexGrow={ 0 }>
              { pageContent }
            </Layout.Content>
          </AppErrorBoundary>
        </Layout.MainColumn>
      </Layout.MainArea>
      <Layout.Footer/>
    </>
  );
};

export default React.memo(SearchResultsPageContent);

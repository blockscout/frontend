import { chakra } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import useRoutedChainSelect from 'lib/multichain/useRoutedChainSelect';
import { Skeleton } from 'toolkit/chakra/skeleton';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import SearchResultsInput from 'ui/searchResults/SearchResultsInput';
import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import * as Layout from 'ui/shared/layout/components';
import ChainSelect from 'ui/shared/multichain/ChainSelect';
import PageTitle from 'ui/shared/Page/PageTitle';
import HeaderAlert from 'ui/snippets/header/HeaderAlert';
import HeaderDesktop from 'ui/snippets/header/HeaderDesktop';
import HeaderMobile from 'ui/snippets/header/HeaderMobile';

import SearchResultTabContent from './SearchResultTabContent';
import useSearchQuery from './useSearchQuery';

const TAB_LIST_PROPS = {
  marginBottom: 0,
  pt: 6,
  pb: 6,
  marginTop: -6,
};
const PRESERVED_PARAMS = [ 'q', 'tab', 'chain_id' ];

const SearchResults = () => {
  const isMobile = useIsMobile();

  const chainSelect = useRoutedChainSelect({
    field: 'chain_id',
    withAllOption: true,
    persistedParams: [ 'q', 'tab' ],
  });
  const { searchTerm, debouncedSearchTerm, handleSearchTermChange, handleSubmit, queries } = useSearchQuery({
    chainSlug: chainSelect.value?.[0],
  });

  const isLoading = Object.values(queries).some((query) => query.isLoading);

  const renderSearchBar = React.useCallback(() => {
    return (
      <SearchResultsInput
        searchTerm={ searchTerm }
        handleSubmit={ handleSubmit }
        handleSearchTermChange={ handleSearchTermChange }
      />
    );
  }, [ handleSearchTermChange, handleSubmit, searchTerm ]);

  const totalResults = (() => {
    if (isLoading) {
      return;
    }

    return Object.values(queries).reduce((acc, query) => {
      return acc + (query.data?.pages?.reduce((acc, page) => acc + page.items.length, 0) ?? 0);
    }, 0);
  })();

  const tabs = [
    {
      id: 'all',
      title: 'All',
      component: <SearchResultTabContent queries={ queries } queryType={ undefined } isLoading={ isLoading } searchTerm={ debouncedSearchTerm }/>,
    },
    {
      id: 'tokens',
      title: 'Tokens (ERC-20)',
      component: <SearchResultTabContent queries={ queries } queryType="tokens" isLoading={ isLoading } searchTerm={ debouncedSearchTerm }/>,
    },
    {
      id: 'nfts',
      title: 'NFTs (ERC-721 & 1155)',
      component: <SearchResultTabContent queries={ queries } queryType="nfts" isLoading={ isLoading } searchTerm={ debouncedSearchTerm }/>,
    },
    {
      id: 'addresses',
      title: 'Addresses',
      component: <SearchResultTabContent queries={ queries } queryType="addresses" isLoading={ isLoading } searchTerm={ debouncedSearchTerm }/>,
    },
    {
      id: 'blocks',
      title: 'Blocks',
      component: <SearchResultTabContent queries={ queries } queryType="blocks" isLoading={ isLoading } searchTerm={ debouncedSearchTerm }/>,
    },
    {
      id: 'block_numbers',
      title: 'Block numbers',
      component: <SearchResultTabContent queries={ queries } queryType="blockNumbers" isLoading={ isLoading } searchTerm={ debouncedSearchTerm }/>,
    },
    {
      id: 'transactions',
      title: 'Transactions',
      component: <SearchResultTabContent queries={ queries } queryType="transactions" isLoading={ isLoading } searchTerm={ debouncedSearchTerm }/>,
    },
  ];

  const rightSlot = (
    <ChainSelect
      value={ chainSelect.value }
      onValueChange={ chainSelect.onValueChange }
      withAllOption
    />
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
            <Layout.Content>
              <PageTitle title="Search results"/>
              <Skeleton loading={ totalResults === undefined } mb={ 6 } w="fit-content">
                Found <chakra.span fontWeight={ 700 }>{ totalResults }</chakra.span> matching results
              </Skeleton>
              <RoutedTabs
                tabs={ tabs }
                variant="secondary"
                size="sm"
                preservedParams={ PRESERVED_PARAMS }
                listProps={ isMobile ? undefined : TAB_LIST_PROPS }
                rightSlot={ rightSlot }
                // rightSlotProps={ TABS_RIGHT_SLOT_PROPS }
                stickyEnabled={ !isMobile }
              />
            </Layout.Content>
          </AppErrorBoundary>
        </Layout.MainColumn>
      </Layout.MainArea>
      <Layout.Footer/>
    </>
  );
};

export default React.memo(SearchResults);

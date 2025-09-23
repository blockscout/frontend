import { Box, chakra } from '@chakra-ui/react';
import React from 'react';

import SearchResultsInput from 'ui/searchResults/SearchResultsInput';
import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import ContentLoader from 'ui/shared/ContentLoader';
import * as Layout from 'ui/shared/layout/components';
import PageTitle from 'ui/shared/Page/PageTitle';
import HeaderAlert from 'ui/snippets/header/HeaderAlert';
import HeaderDesktop from 'ui/snippets/header/HeaderDesktop';
import HeaderMobile from 'ui/snippets/header/HeaderMobile';

import SearchResultsTabAll from './SearchResultsTabAll';
import useSearchQuery from './useSearchQuery';

const SearchResults = () => {
  const [ showContent ] = React.useState(true);
  const { searchTerm, handleSearchTermChange, handleSubmit, queries } = useSearchQuery();

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
    return Object.values(queries).reduce((acc, query) => {
      return acc + (query.data?.pages?.reduce((acc, page) => acc + page.items.length, 0) ?? 0);
    }, 0);
  })();

  const content = <SearchResultsTabAll queries={ queries }/>;

  const pageContent = !showContent || isLoading ? <ContentLoader/> : (
    <>
      <PageTitle title="Search results"/>
      <Box mb={ 6 }>Found <chakra.span fontWeight={ 700 }>{ totalResults }</chakra.span> matching results</Box>
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

export default React.memo(SearchResults);

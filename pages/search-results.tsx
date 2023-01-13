import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import SearchResults from 'ui/pages/SearchResults';

const SearchResultsPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <SearchResults/>
    </>
  );
};

export default SearchResultsPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

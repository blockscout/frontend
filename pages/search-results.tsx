import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';

const SearchResults = dynamic(() => import('ui/pages/SearchResults'), { ssr: false });

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

import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import WatchList from 'ui/pages/Watchlist';

const WatchListPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <WatchList/>
    </>
  );
};

export default WatchListPage;

export { getServerSideProps } from 'lib/next/getServerSidePropsDummy';

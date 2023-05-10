import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import WatchList from 'ui/pages/Watchlist';
import Page from 'ui/shared/Page/Page';

const WatchListPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <Page>
        <WatchList/>
      </Page>
    </>
  );
};

export default WatchListPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

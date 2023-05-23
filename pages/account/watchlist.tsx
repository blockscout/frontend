import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import Page from 'ui/shared/Page/Page';

const WatchList = dynamic(() => import('ui/pages/Watchlist'), { ssr: false });

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

export { getServerSideProps } from 'lib/next/account/getServerSideProps';

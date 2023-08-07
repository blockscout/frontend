import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import Page from 'ui/shared/Page/Page';

const WatchList = dynamic(() => import('ui/pages/Watchlist'), { ssr: false });

const WatchListPage: NextPage = () => {
  return (
    <PageServer pathname="/account/watchlist">
      <Page>
        <WatchList/>
      </Page>
    </PageServer>
  );
};

export default WatchListPage;

export { account as getServerSideProps } from 'lib/next/getServerSideProps';

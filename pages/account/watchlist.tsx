import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';

const WatchList = dynamic(() => import('ui/pages/Watchlist'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageServer pathname="/account/watchlist">
      <WatchList/>
    </PageServer>
  );
};

export default Page;

export { account as getServerSideProps } from 'lib/next/getServerSideProps';

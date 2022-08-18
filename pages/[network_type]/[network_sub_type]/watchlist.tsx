import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import WatchList from 'ui/pages/Watchlist';

const WatchListPage: NextPage = () => {
  return (
    <>
      <Head><title>Watch list</title></Head>
      <WatchList/>
    </>
  );
};

export default WatchListPage;

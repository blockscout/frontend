import { useQuery } from '@tanstack/react-query';
import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import WatchList from 'ui/pages/Watchlist';

const WatchListPage: NextPage = () => {
  useQuery([ 'watchlist' ], async() => {
    const response = await fetch('/api/account/watchlist/get-with-tokens');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });

  return (
    <>
      <Head><title>Watch list</title></Head>
      <WatchList/>
    </>
  );
};

export default WatchListPage;

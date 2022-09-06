import type { NextPage, GetStaticPaths } from 'next';
import Head from 'next/head';
import React from 'react';

import getAvailablePaths from 'lib/networks/getAvailablePaths';
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

export const getStaticPaths: GetStaticPaths = async() => {
  return { paths: getAvailablePaths(), fallback: false };
};

export const getStaticProps = async() => {
  return {
    props: {},
  };
};

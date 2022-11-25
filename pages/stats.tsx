import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import Stats from '../ui/pages/Stats';

const StatsPage: NextPage = () => {
  return (
    <>
      <Head><title>Ethereum Stats</title></Head>
      <Stats/>
    </>
  );
};

export default StatsPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

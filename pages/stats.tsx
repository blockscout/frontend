import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import appConfig from 'configs/app/config';

import Stats from '../ui/pages/Stats';

const StatsPage: NextPage = () => {
  return (
    <>
      <Head><title>{ appConfig.network.name } stats</title></Head>
      <Stats/>
    </>
  );
};

export default StatsPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

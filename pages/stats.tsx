import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import React from 'react';

import appConfig from 'configs/app/config';
import type { Props } from 'lib/next/getServerSideProps';
import { getServerSideProps as getServerSidePropsBase } from 'lib/next/getServerSideProps';

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

export const getServerSideProps: GetServerSideProps<Props> = async(args) => {
  if (!appConfig.statsApi.endpoint) {
    return {
      notFound: true,
    };
  }

  return getServerSidePropsBase(args);
};

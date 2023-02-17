import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import type { PageParams } from 'lib/next/token/types';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import TokenInstance from 'ui/pages/TokenInstance';

const TokenInstancePage: NextPage<PageParams> = () => {
  const title = getNetworkTitle();

  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <TokenInstance/>
    </>
  );
};

export default TokenInstancePage;

export { getServerSideProps } from 'lib/next/token/getServerSideProps';

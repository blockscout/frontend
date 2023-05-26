import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import type { PageParams } from 'lib/next/token/types';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import Page from 'ui/shared/Page/Page';
const TokenInstance = dynamic(() => import('ui/pages/TokenInstance'), { ssr: false });

const TokenInstancePage: NextPage<PageParams> = () => {
  const title = getNetworkTitle();

  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <Page>
        <TokenInstance/>
      </Page>
    </>
  );
};

export default TokenInstancePage;

export { getServerSideProps } from 'lib/next/token/getServerSideProps';

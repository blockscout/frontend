import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import Page from 'ui/shared/Page/Page';

const Tokens = dynamic(() => import('ui/pages/Tokens'), { ssr: false });

const TokensPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <Page>
        <Tokens/>
      </Page>
    </>
  );
};

export default TokensPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

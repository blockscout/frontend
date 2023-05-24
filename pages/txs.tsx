import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import Page from 'ui/shared/Page/Page';

const Transactions = dynamic(() => import('ui/pages/Transactions'), { ssr: false });

const TxsPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head><title>{ title }</title></Head>
      <Page>
        <Transactions/>
      </Page>
    </>
  );
};

export default TxsPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

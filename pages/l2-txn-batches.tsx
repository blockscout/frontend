import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import Page from 'ui/shared/Page/Page';

const L2TxnBatches = dynamic(() => import('ui/pages/L2TxnBatches'), { ssr: false });

const TxnBatchesPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <Page>
        <L2TxnBatches/>
      </Page>
    </>
  );
};

export default TxnBatchesPage;

export { getServerSideProps } from 'lib/next/getServerSidePropsL2';

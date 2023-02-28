import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import TxnBatches from 'ui/pages/TxnBatches';

const TxnBatchesPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <TxnBatches/>
    </>
  );
};

export default TxnBatchesPage;

export { getServerSideProps } from 'lib/next/getServerSidePropsL2';

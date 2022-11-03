import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import Transactions from 'ui/pages/Transactions';

const TxsPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head><title>{ title }</title></Head>
      <Transactions/>
    </>
  );
};

export default TxsPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

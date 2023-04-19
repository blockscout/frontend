import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import L2Withdrawals from 'ui/pages/L2Withdrawals';

const WithdrawalsPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <L2Withdrawals/>
    </>
  );
};

export default WithdrawalsPage;

export { getServerSideProps } from 'lib/next/getServerSidePropsL2';

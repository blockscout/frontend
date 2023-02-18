import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import Withdrawals from 'ui/pages/Withdrawals';

const WithdrawalsPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <Withdrawals/>
    </>
  );
};

export default WithdrawalsPage;

export { getServerSideProps } from 'lib/next/getServerSidePropsL2';

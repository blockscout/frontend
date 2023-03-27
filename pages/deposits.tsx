import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import Deposits from 'ui/pages/Deposits';

const DepositsPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <Deposits/>
    </>
  );
};

export default DepositsPage;

export { getServerSideProps } from 'lib/next/getServerSidePropsL2';

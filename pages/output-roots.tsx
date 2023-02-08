import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import OutputRoots from 'ui/pages/OutputRoots';

const TokensPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <OutputRoots/>
    </>
  );
};

export default TokensPage;

export { getServerSideProps } from 'lib/next/getServerSidePropsL2';

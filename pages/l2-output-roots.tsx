import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import L2OutputRoots from 'ui/pages/L2OutputRoots';

const OutputRootsPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <L2OutputRoots/>
    </>
  );
};

export default OutputRootsPage;

export { getServerSideProps } from 'lib/next/getServerSidePropsL2';

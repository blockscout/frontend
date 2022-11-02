import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import ApiKeys from 'ui/pages/ApiKeys';

const ApiKeysPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head><title>{ title }</title></Head>
      <ApiKeys/>
    </>
  );
};

export default ApiKeysPage;

export { getServerSideProps } from 'lib/next/getServerSidePropsDummy';

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import Page from 'ui/shared/Page/Page';
const ApiKeys = dynamic(() => import('ui/pages/ApiKeys'), { ssr: false });

const ApiKeysPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head><title>{ title }</title></Head>
      <Page>
        <ApiKeys/>
      </Page>
    </>
  );
};

export default ApiKeysPage;

export { getServerSideProps } from 'lib/next/account/getServerSideProps';

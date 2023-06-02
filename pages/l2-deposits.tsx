import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import Page from 'ui/shared/Page/Page';

const L2Deposits = dynamic(() => import('ui/pages/L2Deposits'), { ssr: false });

const DepositsPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <Page>
        <L2Deposits/>
      </Page>
    </>
  );
};

export default DepositsPage;

export { getServerSideProps } from 'lib/next/getServerSidePropsL2';

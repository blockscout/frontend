import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import Page from 'ui/shared/Page/Page';
const VerifiedContracts = dynamic(() => import('ui/pages/VerifiedContracts'), { ssr: false });

const VerifiedContractsPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <Page>
        <VerifiedContracts/>
      </Page>
    </>
  );
};

export default VerifiedContractsPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

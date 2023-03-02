import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import VerifiedContracts from 'ui/pages/VerifiedContracts';
import Page from 'ui/shared/Page/Page';

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

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import Page from 'ui/shared/Page/Page';

const VerifiedAddresses = dynamic(() => import('ui/pages/VerifiedAddresses'), { ssr: false });

const VerifiedAddressesPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head><title>{ title }</title></Head>
      <Page>
        <VerifiedAddresses/>
      </Page>
    </>
  );
};

export default VerifiedAddressesPage;

export { getServerSidePropsForVerifiedAddresses as getServerSideProps } from 'lib/next/account/getServerSideProps';

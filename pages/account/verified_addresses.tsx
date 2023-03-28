import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import VerifiedAddresses from 'ui/pages/VerifiedAddresses';

const VerifiedAddressesPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head><title>{ title }</title></Head>
      <VerifiedAddresses/>
    </>
  );
};

export default VerifiedAddressesPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

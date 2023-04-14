import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import PrivateTags from 'ui/pages/PrivateTags';

const AddressTagsPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head><title>{ title }</title></Head>
      <PrivateTags/>
    </>
  );
};

export default AddressTagsPage;

export { getServerSideProps } from 'lib/next/account/getServerSideProps';

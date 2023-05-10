import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import PrivateTags from 'ui/pages/PrivateTags';
import Page from 'ui/shared/Page/Page';

const AddressTagsPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head><title>{ title }</title></Head>
      <Page>
        <PrivateTags/>
      </Page>
    </>
  );
};

export default AddressTagsPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

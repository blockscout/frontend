import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import Page from 'ui/shared/Page/Page';

const PrivateTags = dynamic(() => import('ui/pages/PrivateTags'), { ssr: false });

const PrivateTagsPage: NextPage = () => {
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

export default PrivateTagsPage;

export { getServerSideProps } from 'lib/next/account/getServerSideProps';

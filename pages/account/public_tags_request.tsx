import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import Page from 'ui/shared/Page/Page';

const PublicTags = dynamic(() => import('ui/pages/PublicTags'), { ssr: false });

const PublicTagsPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head><title>{ title }</title></Head>
      <Page>
        <PublicTags/>
      </Page>
    </>
  );
};

export default PublicTagsPage;

export { getServerSideProps } from 'lib/next/account/getServerSideProps';

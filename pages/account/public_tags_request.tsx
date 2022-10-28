import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import PublicTags from 'ui/pages/PublicTags';

const PublicTagsPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head><title>{ title }</title></Head>
      <PublicTags/>
    </>
  );
};

export default PublicTagsPage;

export { getServerSideProps } from 'lib/next/getServerSidePropsDummy';

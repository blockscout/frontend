import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import Page from 'ui/shared/Page/Page';

const L2OutputRoots = dynamic(() => import('ui/pages/L2OutputRoots'), { ssr: false });

const OutputRootsPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <Page>
        <L2OutputRoots/>
      </Page>
    </>
  );
};

export default OutputRootsPage;

export { getServerSideProps } from 'lib/next/getServerSidePropsL2';

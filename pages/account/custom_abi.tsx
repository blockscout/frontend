import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import Page from 'ui/shared/Page/Page';

const CustomAbi = dynamic(() => import('ui/pages/CustomAbi'), { ssr: false });

const CustomAbiPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head><title>{ title }</title></Head>
      <Page>
        <CustomAbi/>
      </Page>
    </>
  );
};

export default CustomAbiPage;

export { getServerSideProps } from 'lib/next/account/getServerSideProps';

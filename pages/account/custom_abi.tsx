import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import CustomAbi from 'ui/pages/CustomAbi';
import Page from 'ui/shared/Page/Page';

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

export { getServerSideProps } from 'lib/next/getServerSideProps';

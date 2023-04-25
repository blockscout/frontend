import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import Apps from 'ui/pages/Apps';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';

const AppsPage: NextPage = () => {
  return (
    <Page>
      <PageTitle text="Apps"/>
      <Head><title>Blockscout | Marketplace</title></Head>

      <Apps/>
    </Page>
  );
};

export default AppsPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

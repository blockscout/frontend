import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import SwaggerUI from 'ui/SwaggerUI';

const AppsPage: NextPage = () => {
  const networkTitle = getNetworkTitle();

  return (
    <Page>
      <PageTitle text="API Documentation"/>
      <Head><title>{ `API for the ${ networkTitle }` }</title></Head>
      <SwaggerUI/>
    </Page>
  );
};

export default AppsPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

import { Spinner } from '@chakra-ui/react';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
const GraphQL = dynamic(() => import('ui/graphQL/GraphQL'), {
  loading: () => <Spinner/>,
  ssr: false,
});
import Head from 'next/head';
import React from 'react';

import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';

const AppsPage: NextPage = () => {

  return (
    <Page>
      <Head><title>Graph Page</title></Head>
      <PageTitle text="GraphQL playground"/>
      <GraphQL/>
    </Page>
  );
};

export default AppsPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

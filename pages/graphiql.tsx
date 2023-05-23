import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
const GraphQL = dynamic(() => import('ui/graphQL/GraphQL'), {
  loading: () => <ContentLoader/>,
  ssr: false,
});
import Head from 'next/head';
import React from 'react';

import ContentLoader from 'ui/shared/ContentLoader';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';

const GraphiqlPage: NextPage = () => {

  return (
    <Page>
      <Head><title>Graph Page</title></Head>
      <PageTitle title="GraphQL playground"/>
      <GraphQL/>
    </Page>
  );
};

export default GraphiqlPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

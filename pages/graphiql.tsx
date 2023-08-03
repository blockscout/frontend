import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import ContentLoader from 'ui/shared/ContentLoader';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';

const GraphQL = dynamic(() => import('ui/graphQL/GraphQL'), {
  loading: () => <ContentLoader/>,
  ssr: false,
});

const GraphiqlPage: NextPage = () => {

  return (
    <PageServer pathname="/graphiql">
      <Page>
        <PageTitle title="GraphQL playground"/>
        <GraphQL/>
      </Page>
    </PageServer>
  );
};

export default GraphiqlPage;

export { base as getServerSideProps } from 'lib/next/getServerSideProps';

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import ContentLoader from 'ui/shared/ContentLoader';
import PageTitle from 'ui/shared/Page/PageTitle';

const GraphQL = dynamic(() => import('ui/graphQL/GraphQL'), {
  loading: () => <ContentLoader/>,
  ssr: false,
});

const Page: NextPage = () => {

  return (
    <PageServer pathname="/graphiql">
      <PageTitle title="GraphQL playground"/>
      <GraphQL/>
    </PageServer>
  );
};

export default Page;

export { base as getServerSideProps } from 'lib/next/getServerSideProps';

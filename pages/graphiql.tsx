import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import config from 'configs/app';
import ContentLoader from 'ui/shared/ContentLoader';
import PageTitle from 'ui/shared/Page/PageTitle';

const GraphQL = dynamic(() => import('ui/graphQL/GraphQL'), {
  loading: () => <ContentLoader/>,
  ssr: false,
});

const Page: NextPage = () => {

  return (
    <PageNextJs pathname="/graphiql">
      <PageTitle
        title={ config.meta.seo.enhancedDataEnabled ? `GraphiQL ${ config.chain.name } interface` : 'GraphQL playground' }
      />
      <GraphQL/>
    </PageNextJs>
  );
};

export default Page;

export { graphIQl as getServerSideProps } from 'nextjs/getServerSideProps';

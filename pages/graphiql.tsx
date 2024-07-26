import type { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import ContentLoader from 'ui/shared/ContentLoader';
import PageTitle from 'ui/shared/Page/PageTitle';

const GraphQL = dynamic(() => import('ui/graphQL/GraphQL'), {
  loading: () => <ContentLoader/>,
  ssr: false,
});

const Page: NextPage = () => {
  const { t } = useTranslation('common');

  return (
    <PageNextJs pathname="/graphiql">
      <PageTitle title={ t('area.GraphQL_playground') }/>
      <GraphQL/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';

import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import type { RouteName } from 'lib/link/routes';
import Apps from 'ui/pages/Apps';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';

const AppsPage = () => {
  const router = useRouter();
  const { category_id: categoryId } = router.query;

  return (
    <Page>
      <PageTitle text="Apps"/>
      <Head><title>Apps</title></Head>

      { categoryId && <Apps activeRoute={ `apps_category_${ categoryId }` as RouteName } category={ categoryId }/> }
    </Page>
  );
};

export default AppsPage;

export { getStaticPaths } from 'lib/next/apps/getStaticPaths';
export { getStaticProps } from 'lib/next/getStaticProps';

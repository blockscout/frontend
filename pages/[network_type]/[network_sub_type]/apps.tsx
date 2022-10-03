import Head from 'next/head';
import React from 'react';

import Apps from 'ui/pages/Apps';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';

const AppsPage = () => {
  return (
    <Page>
      <PageTitle text="Apps"/>
      <Head><title>Apps</title></Head>

      <Apps/>
    </Page>
  );
};

export default AppsPage;

export { getStaticPaths } from 'lib/next/getStaticPaths';
export { getStaticProps } from 'lib/next/getStaticProps';

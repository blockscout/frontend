import Apps from '~/ui/pages/Apps';
import Page from '~/ui/shared/Page';
import PageHeader from '~/ui/shared/PageHeader';
import Head from 'next/head';
import React from 'react';

const AppsPage = () => {
  return (
    <Page>
      <PageHeader text="Apps"/>
      <Head><title>Apps</title></Head>

      <Apps/>
    </Page>
  );
};

export default AppsPage;

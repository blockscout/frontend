import Head from 'next/head';
import React from 'react';

import Apps from 'ui/pages/Apps';
import Page from 'ui/shared/Page';
import PageTitle from 'ui/shared/PageTitle';

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

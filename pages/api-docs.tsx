import type { NextPage } from 'next';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import SwaggerUI from 'ui/apiDocs/SwaggerUI';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';

const APIDocsPage: NextPage = () => {
  return (
    <PageServer pathname="/api-docs">
      <Page>
        <PageTitle title="API Documentation"/>
        <SwaggerUI/>
      </Page>
    </PageServer>
  );
};

export default APIDocsPage;

export { apiDocs as getServerSideProps } from 'lib/next/getServerSideProps';

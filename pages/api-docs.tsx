import type { NextPage, GetServerSideProps } from 'next';
import React from 'react';

import appConfig from 'configs/app/config';
import { getServerSideProps as getServerSidePropsBase } from 'lib/next/getServerSideProps';
import type { Props } from 'lib/next/getServerSideProps';
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

export const getServerSideProps: GetServerSideProps<Props> = async(args) => {
  if (!appConfig.apiDoc.specUrl) {
    return {
      notFound: true,
    };
  }

  return getServerSidePropsBase(args);
};

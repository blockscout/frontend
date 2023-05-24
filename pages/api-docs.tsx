import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import React from 'react';

import appConfig from 'configs/app/config';
import getNetworkTitle from 'lib/networks/getNetworkTitle';
import { getServerSideProps as getServerSidePropsBase } from 'lib/next/getServerSideProps';
import type { Props } from 'lib/next/getServerSideProps';
import SwaggerUI from 'ui/apiDocs/SwaggerUI';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';

const APIDocsPage: NextPage = () => {
  const networkTitle = getNetworkTitle();

  return (
    <Page>
      <PageTitle title="API Documentation"/>
      <Head><title>{ `API for the ${ networkTitle }` }</title></Head>
      <SwaggerUI/>
    </Page>
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

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import type { PageParams } from 'lib/next/token/types';

import getSeo from 'lib/next/token/getSeo';
import Page from 'ui/shared/Page/Page';

const Token = dynamic(() => import('ui/pages/Token'), { ssr: false });

const TokenPage: NextPage<PageParams> = ({ hash }: PageParams) => {
  const { title, description } = getSeo({ hash });

  return (
    <>
      <Head>
        <title>{ title }</title>
        <meta name="description" content={ description }/>
      </Head>
      <Page>
        <Token/>
      </Page>
    </>
  );
};

export default TokenPage;

export { getServerSideProps } from 'lib/next/token/getServerSideProps';

import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import type { PageParams } from 'lib/next/token/types';

import getSeo from 'lib/next/token/getSeo';
import Token from 'ui/pages/Token';

const TokenPage: NextPage<PageParams> = ({ hash }: PageParams) => {
  const { title, description } = getSeo({ hash });

  return (
    <>
      <Head>
        <title>{ title }</title>
        <meta name="description" content={ description }/>
      </Head>
      <Token/>
    </>
  );
};

export default TokenPage;

export { getServerSideProps } from 'lib/next/token/getServerSideProps';

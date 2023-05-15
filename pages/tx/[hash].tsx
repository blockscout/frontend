import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import type { RoutedQuery } from 'nextjs-routes';
import React from 'react';

import getSeo from 'lib/next/tx/getSeo';
import Page from 'ui/shared/Page/Page';

const Transaction = dynamic(() => import('ui/pages/Transaction'), { ssr: false });

const TransactionPage: NextPage<RoutedQuery<'/tx/[hash]'>> = ({ hash }: RoutedQuery<'/tx/[hash]'>) => {
  const { title, description } = getSeo({ hash });

  return (
    <>
      <Head>
        <title>{ title }</title>
        <meta name="description" content={ description }/>
      </Head>
      <Page>
        <Transaction/>
      </Page>
    </>
  );
};

export default TransactionPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

import type { NextPage } from 'next';
import Head from 'next/head';
import type { RoutedQuery } from 'nextjs-routes';
import React from 'react';

import getSeo from 'lib/next/tx/getSeo';
import Transaction from 'ui/pages/Transaction';

const TransactionPage: NextPage<RoutedQuery<'/tx/[hash]'>> = ({ hash }: RoutedQuery<'/tx/[hash]'>) => {
  const { title, description } = getSeo({ hash });

  return (
    <>
      <Head>
        <title>{ title }</title>
        <meta name="description" content={ description }/>
      </Head>
      <Transaction/>
    </>
  );
};

export default TransactionPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import type { PageParams } from 'lib/next/tx/types';

import getSeo from 'lib/next/tx/getSeo';
import Transaction from 'ui/pages/Transaction';

const TransactionPage: NextPage<PageParams> = ({ id }: PageParams) => {
  const { title, description } = getSeo({ id });

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

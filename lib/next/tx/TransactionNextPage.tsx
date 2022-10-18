import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import type { PageParams } from './types';

import Transaction from 'ui/pages/Transaction';

import getSeo from './getSeo';

type Props = {
  pageParams: PageParams;
}

const TransactionNextPage: NextPage<Props> = ({ pageParams }: Props) => {
  const { title, description } = getSeo(pageParams);
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

export default TransactionNextPage;

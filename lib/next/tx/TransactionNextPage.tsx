import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import type { PageParams } from './types';

import type { Props as TransactionProps } from 'ui/pages/Transaction';
import Transaction from 'ui/pages/Transaction';

import getSeo from './getSeo';

type Props = {
  pageParams: PageParams;
  tab: TransactionProps['tab'];
}

const TransactionNextPage: NextPage<Props> = ({ pageParams, tab }: Props) => {
  const { title } = getSeo(pageParams);
  return (
    <>
      <Head><title>{ title }</title></Head>
      <Transaction tab={ tab }/>
    </>
  );
};

export default TransactionNextPage;

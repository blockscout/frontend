import type { NextPage, GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import Transaction from 'ui/pages/Transaction';

type PageParams = {
  network_type: string;
  network_sub_type: string;
  id: string;
}

type Props = {
  pageParams: PageParams;
}

const TransactionPage: NextPage<Props> = ({ pageParams }: Props) => {
  const title = getNetworkTitle(pageParams || {});
  return (
    <>
      <Head><title>{ title }</title></Head>
      <Transaction/>
    </>
  );
};

export default TransactionPage;

export const getStaticPaths: GetStaticPaths = async() => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps = async(context): Promise<GetStaticPropsResult<Props>> => {
  return {
    props: {
      pageParams: context.params as PageParams,
    },
  };
};

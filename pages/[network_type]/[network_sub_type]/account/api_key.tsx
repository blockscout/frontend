import type { NextPage, GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next';
import Head from 'next/head';
import React from 'react';

import { getAvailablePaths, getNetworkTitle } from 'lib/networks';
import ApiKeys from 'ui/pages/ApiKeys';

type PageParams = {
  network_type: string;
  network_sub_type: string;
}

type Props = {
  pageParams: PageParams;
}

const ApiKeysPage: NextPage<Props> = ({ pageParams }: Props) => {
  const title = getNetworkTitle(pageParams);
  return (
    <>
      <Head><title>{ title }</title></Head>
      <ApiKeys/>
    </>
  );
};

export default ApiKeysPage;

export const getStaticPaths: GetStaticPaths = async() => {
  return { paths: getAvailablePaths(), fallback: false };
};

export const getStaticProps: GetStaticProps = async(context): Promise<GetStaticPropsResult<Props>> => {
  return {
    props: {
      pageParams: context.params as PageParams,
    },
  };
};

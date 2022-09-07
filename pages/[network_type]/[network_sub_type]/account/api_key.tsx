import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
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

export { getStaticPaths } from 'lib/next/account/getStaticPaths';
export { getStaticProps } from 'lib/next/getStaticProps';

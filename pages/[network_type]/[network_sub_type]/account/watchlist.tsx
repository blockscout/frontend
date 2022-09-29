import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import WatchList from 'ui/pages/Watchlist';

type PageParams = {
  network_type: string;
  network_sub_type: string;
}

type Props = {
  pageParams: PageParams;
}

const WatchListPage: NextPage<Props> = ({ pageParams }: Props) => {
  const title = getNetworkTitle(pageParams || {});
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <WatchList/>
    </>
  );
};

export default WatchListPage;

export { getStaticPaths } from 'lib/next/account/getStaticPaths';
export { getStaticProps } from 'lib/next/getStaticProps';

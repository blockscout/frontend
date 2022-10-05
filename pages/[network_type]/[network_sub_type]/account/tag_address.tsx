import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import PrivateTags from 'ui/pages/PrivateTags';

type PageParams = {
  network_type: string;
  network_sub_type: string;
}

type Props = {
  pageParams: PageParams;
}

const AddressTagsPage: NextPage<Props> = ({ pageParams }: Props) => {
  const title = getNetworkTitle(pageParams || {});
  return (
    <>
      <Head><title>{ title }</title></Head>
      <PrivateTags/>
    </>
  );
};

export default AddressTagsPage;

export { getStaticPaths } from 'lib/next/account/getStaticPaths';
export { getStaticProps } from 'lib/next/getStaticProps';

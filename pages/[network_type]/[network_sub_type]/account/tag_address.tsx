import type { NextPage, GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next';
import Head from 'next/head';
import React from 'react';

import { getAvailablePaths, getNetworkTitle } from 'lib/networks';
import PrivateTags from 'ui/pages/PrivateTags';

type PageParams = {
  network_type: string;
  network_sub_type: string;
}

type Props = {
  pageParams: PageParams;
}

const AddressTagsPage: NextPage<Props> = ({ pageParams }: Props) => {
  const title = getNetworkTitle(pageParams);
  return (
    <>
      <Head><title>{ title }</title></Head>
      <PrivateTags tab="address"/>
    </>
  );
};

export default AddressTagsPage;

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

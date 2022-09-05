import type { NextPage, GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next';
import Head from 'next/head';
import React from 'react';

import { getAvailablePaths, getNetworkTitle } from 'lib/networks';
import PublicTags from 'ui/pages/PublicTags';

type PageParams = {
  network_type: string;
  network_sub_type: string;
}

type Props = {
  pageParams: PageParams;
}

const PublicTagsPage: NextPage<Props> = ({ pageParams }: Props) => {
  const title = getNetworkTitle(pageParams);
  return (
    <>
      <Head><title>{ title }</title></Head>
      <PublicTags/>
    </>
  );
};

export default PublicTagsPage;

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

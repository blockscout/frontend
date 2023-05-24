import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import type { RoutedQuery } from 'nextjs-routes';
import React from 'react';

import getSeo from 'lib/next/block/getSeo';
import Page from 'ui/shared/Page/Page';

const Block = dynamic(() => import('ui/pages/Block'), { ssr: false });

const BlockPage: NextPage<RoutedQuery<'/block/[height]'>> = ({ height }: RoutedQuery<'/block/[height]'>) => {
  const { title, description } = getSeo({ height });
  return (
    <>
      <Head>
        <title>{ title }</title>
        <meta name="description" content={ description }/>
      </Head>
      <Page>
        <Block/>
      </Page>
    </>
  );
};

export default BlockPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

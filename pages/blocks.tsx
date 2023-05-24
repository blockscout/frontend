import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import getSeo from 'lib/next/blocks/getSeo';
import Page from 'ui/shared/Page/Page';

const Blocks = dynamic(() => import('ui/pages/Blocks'), { ssr: false });

const BlockPage: NextPage = () => {
  const { title } = getSeo();
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <Page>
        <Blocks/>
      </Page>
    </>
  );
};

export default BlockPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getSeo from 'lib/next/blocks/getSeo';
import Blocks from 'ui/pages/Blocks';

const BlockPage: NextPage = () => {
  const { title } = getSeo();
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <Blocks/>
    </>
  );
};

export default BlockPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

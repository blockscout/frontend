import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import Blocks from 'ui/pages/Blocks';

import getSeo from './getSeo';

const BlocksNextPage: NextPage = () => {
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

export default BlocksNextPage;

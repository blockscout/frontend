import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import type { PageParams } from './types';

import Blocks from 'ui/pages/Blocks';

import getSeo from './getSeo';

type Props = {
  pageParams: PageParams;
}

const BlocksNextPage: NextPage<Props> = ({ pageParams }: Props) => {
  const { title } = getSeo(pageParams);
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

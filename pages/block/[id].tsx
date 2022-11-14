import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import type { PageParams } from 'lib/next/block/types';

import getSeo from 'lib/next/block/getSeo';
import Block from 'ui/pages/Block';

const BlockPage: NextPage<PageParams> = ({ id }: PageParams) => {
  const { title, description } = getSeo({ id });
  return (
    <>
      <Head>
        <title>{ title }</title>
        <meta name="description" content={ description }/>
      </Head>
      <Block/>
    </>
  );
};

export default BlockPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

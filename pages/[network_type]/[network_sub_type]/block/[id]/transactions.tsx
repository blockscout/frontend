import type { NextPage } from 'next';
import React from 'react';

import type { PageParams } from 'lib/next/tx/types';

import BlockNextPage from 'lib/next/block/BlockNextPage';

type Props = {
  pageParams: PageParams;
}

const BlockPage: NextPage<Props> = ({ pageParams }: Props) => {
  return (
    <BlockNextPage tab="block_txs" pageParams={ pageParams }/>
  );
};

export default BlockPage;

export { getStaticPaths } from 'lib/next/block/getStaticPaths';
export { getStaticProps } from 'lib/next/getStaticProps';

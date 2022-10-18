import type { NextPage } from 'next';
import React from 'react';

import type { PageParams } from 'lib/next/tx/types';

import BlockNextPage from 'lib/next/block/BlockNextPage';

type Props = {
  pageParams: PageParams;
}

const BlockPage: NextPage<Props> = ({ pageParams }: Props) => {
  return (
    <BlockNextPage pageParams={ pageParams }/>
  );
};

export default BlockPage;

export { getStaticPaths } from 'lib/next/getStaticPaths';
export { getStaticProps } from 'lib/next/getStaticProps';

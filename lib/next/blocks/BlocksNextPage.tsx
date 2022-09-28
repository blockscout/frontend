import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import type { PageParams } from './types';

import Blocks from 'ui/pages/Blocks';
import type { Props as BlocksProps } from 'ui/pages/Blocks';

import getSeo from './getSeo';

type Props = {
  pageParams: PageParams;
  tab: BlocksProps['tab'];
}

const BlocksNextPage: NextPage<Props> = ({ pageParams, tab }: Props) => {
  const { title } = getSeo(pageParams);
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <Blocks tab={ tab }/>
    </>
  );
};

export default BlocksNextPage;

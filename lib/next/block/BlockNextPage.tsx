import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import type { PageParams } from './types';

import Block from 'ui/pages/Block';
import type { Props as BlockProps } from 'ui/pages/Block';

import getSeo from './getSeo';

type Props = {
  pageParams: PageParams;
  tab: BlockProps['tab'];
}

const BlockNextPage: NextPage<Props> = ({ pageParams, tab }: Props) => {
  const { title, description } = getSeo(pageParams);
  return (
    <>
      <Head>
        <title>{ title }</title>
        <meta name="description" content={ description }/>
      </Head>
      <Block tab={ tab }/>
    </>
  );
};

export default BlockNextPage;

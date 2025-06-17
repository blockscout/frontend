import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

import { MultichainProvider } from 'lib/contexts/multichain';

const Block = dynamic(() => import('ui/pages/Block'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/chain/[chain-slug]/block/[height_or_hash]" query={ props.query }>
      <MultichainProvider>
        <Block/>
      </MultichainProvider>
    </PageNextJs>
  );
};

export default Page;

export { opSuperchain as getServerSideProps } from 'nextjs/getServerSideProps';

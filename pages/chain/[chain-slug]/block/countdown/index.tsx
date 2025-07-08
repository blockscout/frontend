import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

import { MultichainProvider } from 'lib/contexts/multichain';

const BlockCountdownIndex = dynamic(() => import('ui/pages/BlockCountdownIndex'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/chain/[chain-slug]/block/countdown" query={ props.query }>
      <MultichainProvider>
        <BlockCountdownIndex/>
      </MultichainProvider>
    </PageNextJs>
  );
};

export default Page;

export { opSuperchain as getServerSideProps } from 'nextjs/getServerSideProps';

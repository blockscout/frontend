import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

const ZkEvmL2TxnBatch = dynamic(() => import('ui/pages/ZkEvmL2TxnBatch'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/zkevm-l2-txn-batch/[number]" query={ props }>
      <ZkEvmL2TxnBatch/>
    </PageNextJs>
  );
};

export default Page;

export { zkEvmL2 as getServerSideProps } from 'nextjs/getServerSideProps';

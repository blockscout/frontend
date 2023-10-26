import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const ZkEvmL2TxnBatches = dynamic(() => import('ui/pages/ZkEvmL2TxnBatches'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/zkevm-l2-txn-batches">
      <ZkEvmL2TxnBatches/>
    </PageNextJs>
  );
};

export default Page;

export { zkEvmL2 as getServerSideProps } from 'nextjs/getServerSideProps';

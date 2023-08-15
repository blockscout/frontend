import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const L2TxnBatches = dynamic(() => import('ui/pages/L2TxnBatches'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/l2-txn-batches">
      <L2TxnBatches/>
    </PageNextJs>
  );
};

export default Page;

export { L2 as getServerSideProps } from 'nextjs/getServerSideProps';

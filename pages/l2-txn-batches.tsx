import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';

const L2TxnBatches = dynamic(() => import('ui/pages/L2TxnBatches'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageServer pathname="/l2-txn-batches">
      <L2TxnBatches/>
    </PageServer>
  );
};

export default Page;

export { L2 as getServerSideProps } from 'lib/next/getServerSideProps';

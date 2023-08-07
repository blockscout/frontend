import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import Page from 'ui/shared/Page/Page';

const L2TxnBatches = dynamic(() => import('ui/pages/L2TxnBatches'), { ssr: false });

const TxnBatchesPage: NextPage = () => {
  return (
    <PageServer pathname="/l2-txn-batches">
      <Page>
        <L2TxnBatches/>
      </Page>
    </PageServer>
  );
};

export default TxnBatchesPage;

export { L2 as getServerSideProps } from 'lib/next/getServerSideProps';

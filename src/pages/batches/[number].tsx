// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'src/server/getServerSideProps/handlers';
import PageNextJs from 'src/server/PageNextJs';

import config from 'src/config';

const rollupFeature = config.features.rollup;

const Batch = dynamic(() => {
  if (!rollupFeature.isEnabled) {
    throw new Error('Rollup feature is not enabled.');
  }

  switch (rollupFeature.type) {
    case 'arbitrum':
      return import('src/features/rollup/arbitrum/pages/batch-details/ArbitrumL2TxnBatch');
    case 'optimistic':
      return import('src/features/rollup/optimism/pages/batch-details/OptimisticL2TxnBatch');
    case 'zkSync':
      return import('src/features/rollup/zk-sync/pages/batch-details/ZkSyncL2TxnBatch');
    case 'scroll':
      return import('src/features/rollup/scroll/pages/batch-details/ScrollL2TxnBatch');
  }
  throw new Error('Txn batches feature is not enabled.');
}, { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/batches/[number]" query={ props.query }>
      <Batch/>
    </PageNextJs>
  );
};

export default Page;

export { batch as getServerSideProps } from 'src/server/getServerSideProps/main';

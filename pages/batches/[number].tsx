// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps/handlers';
import PageNextJs from 'nextjs/PageNextJs';

import config from 'configs/app';

const rollupFeature = config.features.rollup;

const Batch = dynamic(() => {
  if (!rollupFeature.isEnabled) {
    throw new Error('Rollup feature is not enabled.');
  }

  switch (rollupFeature.type) {
    case 'arbitrum':
      return import('client/features/rollup/arbitrum/pages/batch-details/ArbitrumL2TxnBatch');
    case 'optimistic':
      return import('client/features/rollup/optimism/pages/batch-details/OptimisticL2TxnBatch');
    case 'zkSync':
      return import('client/features/rollup/zk-sync/pages/batch-details/ZkSyncL2TxnBatch');
    case 'scroll':
      return import('client/features/rollup/scroll/pages/batch-details/ScrollL2TxnBatch');
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

export { batch as getServerSideProps } from 'nextjs/getServerSideProps/main';

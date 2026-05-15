// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import config from 'configs/app';
const rollupFeature = config.features.rollup;

const Batches = dynamic(() => {
  if (!rollupFeature.isEnabled) {
    throw new Error('Rollup feature is not enabled.');
  }

  switch (rollupFeature.type) {
    case 'zkSync':
      return import('ui/pages/ZkSyncL2TxnBatches');
    case 'optimistic':
      return import('client/features/rollup/optimism/pages/batches/OptimisticL2TxnBatches');
    case 'arbitrum':
      return import('ui/pages/ArbitrumL2TxnBatches');
    case 'scroll':
      return import('ui/pages/ScrollL2TxnBatches');
  }
  throw new Error('Txn batches feature is not enabled.');
}, { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/batches">
      <Batches/>
    </PageNextJs>
  );
};

export default Page;

export { rollup as getServerSideProps } from 'nextjs/getServerSideProps/main';

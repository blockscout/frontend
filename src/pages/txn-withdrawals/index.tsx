// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

import config from 'src/config';

const rollupFeature = config.features.rollup;

const Withdrawals = dynamic(() => {
  if (rollupFeature.isEnabled && rollupFeature.type === 'arbitrum') {
    return import('src/features/rollup/arbitrum/pages/txn-withdrawals/ArbitrumL2TxnWithdrawals');
  }

  throw new Error('Txn withdrawals feature is not enabled.');
}, { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/txn-withdrawals">
      <Withdrawals/>
    </PageNextJs>
  );
};

export default Page;

export { txnWithdrawals as getServerSideProps } from 'src/server/getServerSideProps/main';

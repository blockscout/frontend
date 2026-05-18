// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import config from 'configs/app';
const rollupFeature = config.features.rollup;
const beaconChainFeature = config.features.beaconChain;

const Withdrawals = dynamic(() => {
  if (rollupFeature.isEnabled && rollupFeature.type === 'optimistic') {
    return import('client/features/rollup/optimism/pages/withdrawals/OptimisticL2Withdrawals');
  }

  if (rollupFeature.isEnabled && rollupFeature.type === 'arbitrum') {
    return import('client/features/rollup/arbitrum/pages/withdrawals/ArbitrumL2Withdrawals');
  }

  if (rollupFeature.isEnabled && rollupFeature.type === 'shibarium') {
    return import('client/features/rollup/shibarium/pages/withdrawals/ShibariumWithdrawals');
  }

  if (rollupFeature.isEnabled && rollupFeature.type === 'scroll') {
    return import('client/features/rollup/scroll/pages/withdrawals/ScrollL2Withdrawals');
  }

  if (beaconChainFeature.isEnabled) {
    return import('client/features/chain-variants/beacon-chain/pages/withdrawals/BeaconChainWithdrawals');
  }

  throw new Error('Withdrawals feature is not enabled.');
}, { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/withdrawals">
      <Withdrawals/>
    </PageNextJs>
  );
};

export default Page;

export { withdrawals as getServerSideProps } from 'nextjs/getServerSideProps/main';

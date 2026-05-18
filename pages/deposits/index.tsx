// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import config from 'configs/app';
const rollupFeature = config.features.rollup;
const beaconChainFeature = config.features.beaconChain;

const Deposits = dynamic(() => {
  if (rollupFeature.isEnabled && rollupFeature.type === 'optimistic') {
    return import('client/features/rollup/optimism/pages/deposits/OptimisticL2Deposits');
  }

  if (rollupFeature.isEnabled && rollupFeature.type === 'arbitrum') {
    return import('client/features/rollup/arbitrum/pages/deposits/ArbitrumL2Deposits');
  }

  if (rollupFeature.isEnabled && rollupFeature.type === 'shibarium') {
    return import('client/features/rollup/shibarium/pages/deposits/ShibariumDeposits');
  }

  if (rollupFeature.isEnabled && rollupFeature.type === 'scroll') {
    return import('client/features/rollup/scroll/pages/deposits/ScrollL2Deposits');
  }

  if (beaconChainFeature.isEnabled && !beaconChainFeature.withdrawalsOnly) {
    return import('client/features/chain-variants/beacon-chain/pages/deposits/BeaconChainDeposits');
  }

  throw new Error('Deposits feature is not enabled.');
}, { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/deposits">
      <Deposits/>
    </PageNextJs>
  );
};

export default Page;

export { deposits as getServerSideProps } from 'nextjs/getServerSideProps/main';

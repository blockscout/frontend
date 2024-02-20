import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import config from 'configs/app';
const rollupFeature = config.features.rollup;
const beaconChainFeature = config.features.beaconChain;

const Withdrawals = dynamic(() => {
  if (rollupFeature.isEnabled && rollupFeature.type === 'optimistic') {
    return import('ui/pages/OptimisticL2Withdrawals');
  }

  if (rollupFeature.isEnabled && rollupFeature.type === 'shibarium') {
    return import('ui/pages/ShibariumWithdrawals');
  }

  if (beaconChainFeature.isEnabled) {
    return import('ui/pages/BeaconChainWithdrawals');
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

export { withdrawals as getServerSideProps } from 'nextjs/getServerSideProps';

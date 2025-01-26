import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import config from 'configs/app';
const rollupFeature = config.features.rollup;

const Deposits = dynamic(() => {
  if (rollupFeature.isEnabled && rollupFeature.type === 'optimistic') {
    return import('ui/pages/OptimisticL2Deposits');
  }

  if (rollupFeature.isEnabled && rollupFeature.type === 'arbitrum') {
    return import('ui/pages/ArbitrumL2Deposits');
  }

  if (rollupFeature.isEnabled && rollupFeature.type === 'shibarium') {
    return import('ui/pages/ShibariumDeposits');
  }

  if (rollupFeature.isEnabled && rollupFeature.type === 'zkEvm') {
    return import('ui/pages/ZkEvmL2Deposits');
  }

  if (rollupFeature.isEnabled && rollupFeature.type === 'scroll') {
    return import('ui/pages/ScrollL2Deposits');
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

export { deposits as getServerSideProps } from 'nextjs/getServerSideProps';

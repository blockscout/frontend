import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import config from 'configs/app';
const rollupFeature = config.features.rollup;

const Withdrawals = dynamic(() => {
  if (rollupFeature.isEnabled && rollupFeature.type === 'optimistic') {
    return import('ui/pages/L2Withdrawals');
  }
  return import('ui/pages/Withdrawals');
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

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import config from 'configs/app';

const InternalTxs = dynamic(() => {
  if (config.features.opSuperchain.isEnabled) {
    return import('ui/optimismSuperchain/internalTxs/OpSuperchainInternalTxs');
  }

  return import('ui/pages/InternalTxs');
}, { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/internal-txs">
      <InternalTxs/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps/main';

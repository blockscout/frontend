// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import config from 'configs/app';

const InternalTxs = dynamic(() => {
  if (config.features.multichain.isEnabled) {
    return import('ui/multichain/internalTxs/MultichainInternalTxs');
  }

  return import('client/slices/internal-tx/pages/index/InternalTxs');
}, { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/internal-txs">
      <InternalTxs/>
    </PageNextJs>
  );
};

export default Page;

export { internalTx as getServerSideProps } from 'nextjs/getServerSideProps/main';

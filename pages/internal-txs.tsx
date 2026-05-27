// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const InternalTxs = dynamic(() => {
  if (config.features.multichain.isEnabled) {
    return import('client/features/multichain/pages/internal-txs/MultichainInternalTxs');
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

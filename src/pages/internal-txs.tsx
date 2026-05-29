// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

import config from 'src/config';

const InternalTxs = dynamic(() => {
  if (config.features.multichain.isEnabled) {
    return import('src/features/multichain/pages/internal-txs/MultichainInternalTxs');
  }

  return import('src/slices/internal-tx/pages/index/InternalTxs');
}, { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/internal-txs">
      <InternalTxs/>
    </PageNextJs>
  );
};

export default Page;

export { internalTx as getServerSideProps } from 'src/server/getServerSideProps/main';

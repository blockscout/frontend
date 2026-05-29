// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

import config from 'src/config';

const Transactions = dynamic(() => {
  if (config.features.multichain.isEnabled) {
    return import('src/features/multichain/pages/txs/MultichainTxs');
  }

  if (config.features.zetachain.isEnabled) {
    return import('src/features/chain-variants/zeta-chain/pages/cctx-index/TransactionsZetaChain');
  }

  if (config.features.crossChainTxs.isEnabled) {
    return import('src/features/cross-chain-txs/pages/txs/Transactions');
  }

  return import('src/slices/tx/pages/index/TxIndex');
}, { ssr: false });

const Page: NextPage = () => {

  return (
    <PageNextJs pathname="/txs">
      <Transactions/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'src/server/getServerSideProps/main';

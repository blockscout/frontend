// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import config from 'client/config';

const Transactions = dynamic(() => {
  if (config.features.multichain.isEnabled) {
    return import('client/features/multichain/pages/txs/MultichainTxs');
  }

  if (config.features.zetachain.isEnabled) {
    return import('client/features/chain-variants/zeta-chain/pages/cctx-index/TransactionsZetaChain');
  }

  if (config.features.crossChainTxs.isEnabled) {
    return import('client/features/cross-chain-txs/pages/txs/Transactions');
  }

  return import('client/slices/tx/pages/index/TxIndex');
}, { ssr: false });

const Page: NextPage = () => {

  return (
    <PageNextJs pathname="/txs">
      <Transactions/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps/main';

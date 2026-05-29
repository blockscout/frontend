// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'src/server/getServerSideProps/handlers';
import PageNextJs from 'src/server/PageNextJs';

const TxCrossChain = dynamic(() => import('src/features/cross-chain-txs/pages/tx/TxCrossChain'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/cross-chain-tx/[id]" query={ props.query }>
      <TxCrossChain/>
    </PageNextJs>
  );
};

export default Page;

export { crossChainTxs as getServerSideProps } from 'src/server/getServerSideProps/main';

import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import BridgedTokens from 'client/features/cross-chain-txs/pages/bridged-tokens/BridgedTokens';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/bridged-tokens">
      <BridgedTokens/>
    </PageNextJs>
  );
};

export default Page;

export { crossChainTxs as getServerSideProps } from 'nextjs/getServerSideProps/main';

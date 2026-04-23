import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import IcttUsers from 'client/features/cross-chain-txs/pages/ictt-users/IcttUsers';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/ictt-users">
      <IcttUsers/>
    </PageNextJs>
  );
};

export default Page;

export { crossChainTxs as getServerSideProps } from 'nextjs/getServerSideProps/main';

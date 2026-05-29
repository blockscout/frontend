// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

import IcttUsers from 'src/features/cross-chain-txs/pages/ictt-users/IcttUsers';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/ictt-users">
      <IcttUsers/>
    </PageNextJs>
  );
};

export default Page;

export { crossChainTxs as getServerSideProps } from 'src/server/getServerSideProps/main';

// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import ChainStatsIndex from 'client/features/chain-stats/pages/index/ChainStatsIndex';
import MultichainStats from 'client/features/multichain/pages/stats/MultichainStats';

import config from 'client/config';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/stats">
      { config.features.multichain.isEnabled ? <MultichainStats/> : <ChainStatsIndex/> }
    </PageNextJs>
  );
};

export default Page;

export { stats as getServerSideProps } from 'nextjs/getServerSideProps/main';

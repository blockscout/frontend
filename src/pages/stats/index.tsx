// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

import ChainStatsIndex from 'src/features/chain-stats/pages/index/ChainStatsIndex';
import MultichainStats from 'src/features/multichain/pages/stats/MultichainStats';

import config from 'src/config';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/stats">
      { config.features.multichain.isEnabled ? <MultichainStats/> : <ChainStatsIndex/> }
    </PageNextJs>
  );
};

export default Page;

export { stats as getServerSideProps } from 'src/server/getServerSideProps/main';

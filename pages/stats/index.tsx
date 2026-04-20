import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import ChainStatsIndex from 'client/features/chain-stats/pages/index/ChainStatsIndex';
import config from 'configs/app';
import MultichainStats from 'ui/multichain/stats/MultichainStats';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/stats">
      { config.features.multichain.isEnabled ? <MultichainStats/> : <ChainStatsIndex/> }
    </PageNextJs>
  );
};

export default Page;

export { stats as getServerSideProps } from 'nextjs/getServerSideProps/main';

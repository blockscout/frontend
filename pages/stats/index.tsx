import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import config from 'configs/app';
import OpSuperchainStats from 'ui/optimismSuperchain/stats/OpSuperchainStats';
import Stats from 'ui/pages/Stats';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/stats">
      { config.features.opSuperchain.isEnabled ? <OpSuperchainStats/> : <Stats/> }
    </PageNextJs>
  );
};

export default Page;

export { stats as getServerSideProps } from 'nextjs/getServerSideProps/main';

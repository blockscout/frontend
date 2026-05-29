// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

const DisputeGames = dynamic(() => import('src/features/rollup/optimism/pages/dispute-games/OptimisticL2DisputeGames'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/dispute-games">
      <DisputeGames/>
    </PageNextJs>
  );
};

export default Page;

export { disputeGames as getServerSideProps } from 'src/server/getServerSideProps/main';

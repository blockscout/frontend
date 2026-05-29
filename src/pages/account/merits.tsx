// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

const RewardsDashboard = dynamic(() => import('src/features/rewards/pages/dashboard/RewardsDashboard'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/account/merits">
      <RewardsDashboard/>
    </PageNextJs>
  );
};

export default Page;

export { account as getServerSideProps } from 'src/server/getServerSideProps/main';

// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

const GasTracker = dynamic(() => import('src/features/gas-tracker/pages/index/GasTracker'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/gas-tracker">
      <GasTracker/>
    </PageNextJs>
  );
};

export default Page;

export { gasTracker as getServerSideProps } from 'src/server/getServerSideProps/main';

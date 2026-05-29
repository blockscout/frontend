// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

const HotContracts = dynamic(() => import('src/features/hot-contracts/pages/index/HotContracts'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/hot-contracts">
      <HotContracts/>
    </PageNextJs>
  );
};

export default Page;

export { hotContracts as getServerSideProps } from 'src/server/getServerSideProps/main';

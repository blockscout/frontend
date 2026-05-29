// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

const Marketplace = dynamic(() => import('src/features/marketplace/pages/index/Marketplace'), { ssr: false });

const Page: NextPage = () => (
  <PageNextJs pathname="/apps">
    <Marketplace/>
  </PageNextJs>
);

export default Page;

export { marketplace as getServerSideProps } from 'src/server/getServerSideProps/main';

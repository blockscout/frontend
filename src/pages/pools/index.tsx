// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

const Pools = dynamic(() => import('src/features/dex-pools/pages/index/Pools'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/pools">
      <Pools/>
    </PageNextJs>
  );
};

export default Page;

export { pools as getServerSideProps } from 'src/server/getServerSideProps/main';

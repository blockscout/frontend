// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

const MultichainEcosystems = dynamic(() => import('src/features/multichain/pages/ecosystems/MultichainEcosystems'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/ecosystems">
      <MultichainEcosystems/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'src/server/getServerSideProps/main';

// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

const OutputRoots = dynamic(() => import('src/features/rollup/optimism/pages/output-roots/OptimisticL2OutputRoots'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/output-roots">
      <OutputRoots/>
    </PageNextJs>
  );
};

export default Page;

export { outputRoots as getServerSideProps } from 'src/server/getServerSideProps/main';

// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

const Epochs = dynamic(() => import('src/features/chain-variants/celo/pages/epoch-index/Epochs'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/epochs">
      <Epochs/>
    </PageNextJs>
  );
};

export default Page;

export { celo as getServerSideProps } from 'src/server/getServerSideProps/main';

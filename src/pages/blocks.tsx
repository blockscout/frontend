// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

import config from 'src/config';

const Blocks = dynamic(() => {
  if (config.features.multichain.isEnabled) {
    return import('src/features/multichain/pages/blocks/MultichainBlocks');
  }

  return import('src/slices/block/pages/index/Blocks');
}, { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/blocks">
      <Blocks/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'src/server/getServerSideProps/main';

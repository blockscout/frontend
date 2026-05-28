// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import config from 'client/config';

const Blocks = dynamic(() => {
  if (config.features.multichain.isEnabled) {
    return import('client/features/multichain/pages/blocks/MultichainBlocks');
  }

  return import('client/slices/block/pages/index/Blocks');
}, { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/blocks">
      <Blocks/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps/main';

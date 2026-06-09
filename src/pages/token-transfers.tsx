// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

import config from 'src/config';

const TokenTransfers = dynamic(() => {
  if (config.features.multichain.isEnabled) {
    return import('src/features/multichain/pages/token-transfers/MultichainTokenTransfers');
  }

  return import('src/slices/token-transfer/pages/index/TokenTransfers');
}, { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/token-transfers">
      <TokenTransfers/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'src/server/getServerSideProps/main';

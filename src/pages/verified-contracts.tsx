// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

import config from 'src/config';

const VerifiedContracts = dynamic(() => {
  if (config.features.multichain.isEnabled) {
    return import('src/features/multichain/pages/contracts/MultichainVerifiedContracts');
  }

  return import('src/slices/contract/pages/index/VerifiedContracts');
}, { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/verified-contracts">
      <VerifiedContracts/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'src/server/getServerSideProps/main';

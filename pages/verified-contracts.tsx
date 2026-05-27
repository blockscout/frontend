// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const VerifiedContracts = dynamic(() => {
  if (config.features.multichain.isEnabled) {
    return import('client/features/multichain/pages/contracts/MultichainVerifiedContracts');
  }

  return import('client/slices/contract/pages/index/VerifiedContracts');
}, { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/verified-contracts">
      <VerifiedContracts/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps/main';

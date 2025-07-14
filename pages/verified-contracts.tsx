import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import config from 'configs/app';

const VerifiedContracts = dynamic(() => {
  if (config.features.opSuperchain.isEnabled) {
    return import('ui/optimismSuperchain/verifiedContracts/OpSuperchainVerifiedContracts');
  }

  return import('ui/pages/VerifiedContracts');
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

// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const UserOps = dynamic(() => {
  if (config.features.multichain.isEnabled) {
    return import('client/features/multichain/pages/user-ops/MultichainUserOps');
  }

  return import('client/features/user-ops/pages/index/UserOps');
}, { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/ops">
      <UserOps/>
    </PageNextJs>
  );
};

export default Page;

export { userOps as getServerSideProps } from 'nextjs/getServerSideProps/main';

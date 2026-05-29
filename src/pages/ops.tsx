// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

import config from 'src/config';

const UserOps = dynamic(() => {
  if (config.features.multichain.isEnabled) {
    return import('src/features/multichain/pages/user-ops/MultichainUserOps');
  }

  return import('src/features/user-ops/pages/index/UserOps');
}, { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/ops">
      <UserOps/>
    </PageNextJs>
  );
};

export default Page;

export { userOps as getServerSideProps } from 'src/server/getServerSideProps/main';

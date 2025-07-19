import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import config from 'configs/app';

const UserOps = dynamic(() => {
  if (config.features.opSuperchain.isEnabled) {
    return import('ui/optimismSuperchain/userOps/OpSuperchainUserOps');
  }

  return import('ui/pages/UserOps');
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

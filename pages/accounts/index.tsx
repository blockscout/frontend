// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import config from 'configs/app';

const Accounts = dynamic(() => {
  if (config.features.multichain.isEnabled) {
    return import('ui/multichain/accounts/MultichainAccounts');
  }

  return import('client/slices/address/pages/index/Accounts');
}, { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/accounts">
      <Accounts/>
    </PageNextJs>
  );
};

export default Page;

export { accounts as getServerSideProps } from 'nextjs/getServerSideProps/main';

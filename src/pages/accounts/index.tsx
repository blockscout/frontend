// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

import config from 'src/config';

const Accounts = dynamic(() => {
  if (config.features.multichain.isEnabled) {
    return import('src/features/multichain/pages/addresses/MultichainAccounts');
  }

  return import('src/slices/address/pages/index/Accounts');
}, { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/accounts">
      <Accounts/>
    </PageNextJs>
  );
};

export default Page;

export { accounts as getServerSideProps } from 'src/server/getServerSideProps/main';

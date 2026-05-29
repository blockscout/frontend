// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

import { MultichainProvider } from 'src/features/multichain/context';

const AccountsLabelSearch = dynamic(() => import('src/features/address-metadata/pages/tag-search/TagSearch'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/chain/[chain_slug_or_id]/accounts/label/[slug]">
      <MultichainProvider>
        <AccountsLabelSearch/>
      </MultichainProvider>
    </PageNextJs>
  );
};

export default Page;

export { accountsLabelSearch as getServerSideProps } from 'src/server/getServerSideProps/multichain';

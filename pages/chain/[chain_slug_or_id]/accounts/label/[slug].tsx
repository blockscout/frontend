// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import { MultichainProvider } from 'client/features/multichain/context';

const AccountsLabelSearch = dynamic(() => import('client/features/address-metadata/pages/tag-search/TagSearch'), { ssr: false });

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

export { accountsLabelSearch as getServerSideProps } from 'nextjs/getServerSideProps/multichain';

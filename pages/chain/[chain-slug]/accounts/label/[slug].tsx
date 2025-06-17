import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import { MultichainProvider } from 'lib/contexts/multichain';

const AccountsLabelSearch = dynamic(() => import('ui/pages/AccountsLabelSearch'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/chain/[chain-slug]/accounts/label/[slug]">
      <MultichainProvider>
        <AccountsLabelSearch/>
      </MultichainProvider>
    </PageNextJs>
  );
};

export default Page;

export { opSuperchainAccountsLabelSearch as getServerSideProps } from 'nextjs/getServerSideProps';

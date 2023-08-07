import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import Page from 'ui/shared/Page/Page';

const Accounts = dynamic(() => import('ui/pages/Accounts'), { ssr: false });

const AccountsPage: NextPage = () => {
  return (
    <PageServer pathname="/accounts">
      <Page>
        <Accounts/>
      </Page>
    </PageServer>
  );
};

export default AccountsPage;

export { base as getServerSideProps } from 'lib/next/getServerSideProps';

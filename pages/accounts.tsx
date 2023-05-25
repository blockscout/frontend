import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import Page from 'ui/shared/Page/Page';

const Accounts = dynamic(() => import('ui/pages/Accounts'), { ssr: false });

const AccountsPage: NextPage = () => {
  const title = `Top Accounts - ${ getNetworkTitle() }`;
  return (
    <>
      <Head><title>{ title }</title></Head>
      <Page>
        <Accounts/>
      </Page>
    </>
  );
};

export default AccountsPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

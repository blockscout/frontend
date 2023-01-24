import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import Accounts from 'ui/pages/Accounts';

const AccountsPage: NextPage = () => {
  const title = `Top Accounts - ${ getNetworkTitle() }`;
  return (
    <>
      <Head><title>{ title }</title></Head>
      <Accounts/>
    </>
  );
};

export default AccountsPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

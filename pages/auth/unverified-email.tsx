import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import UnverifiedEmail from 'ui/pages/UnverifiedEmail';
import Page from 'ui/shared/Page/Page';

const UnverifiedEmailPage: NextPage = () => {
  const title = getNetworkTitle();

  return (
    <>
      <Head><title>{ title }</title></Head>
      <Page>
        <UnverifiedEmail/>
      </Page>
    </>
  );
};

export default UnverifiedEmailPage;

export { getServerSideProps } from 'lib/next/account/getServerSideProps';

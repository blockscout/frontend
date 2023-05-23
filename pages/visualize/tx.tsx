import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import Page from 'ui/shared/Page/Page';
import TxSchema from 'ui/txSchema/TxSchema';

const TxSchemaPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <Page>
        <TxSchema/>
      </Page>
    </>
  );
};

export default TxSchemaPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

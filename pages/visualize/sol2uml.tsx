import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import Sol2Uml from 'ui/pages/Sol2Uml';

const Sol2UmlPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <Sol2Uml/>
    </>
  );
};

export default Sol2UmlPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

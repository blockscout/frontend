import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import Page from 'ui/shared/Page/Page';

const MarketplaceApp = dynamic(() => import('ui/pages/MarketplaceApp'), { ssr: false });

const MarketplaceAppPage: NextPage = () => {
  return (
    <>
      <Head><title>Blockscout | Marketplace</title></Head>
      <Page wrapChildren={ false }>
        <MarketplaceApp/>
      </Page>
    </>
  );
};

export default MarketplaceAppPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

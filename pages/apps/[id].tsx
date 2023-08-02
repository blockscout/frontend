import type { NextPage, GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import appConfig from 'configs/app/config';
import type { Props } from 'lib/next/getServerSideProps';
import { getServerSideProps as getServerSidePropsBase } from 'lib/next/getServerSideProps';
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

export const getServerSideProps: GetServerSideProps<Props> = async(args) => {
  if (!appConfig.marketplace.configUrl || !appConfig.network.rpcUrl) {
    return {
      notFound: true,
    };
  }

  return getServerSidePropsBase(args);
};

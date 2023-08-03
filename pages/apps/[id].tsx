import type { NextPage, GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import appConfig from 'configs/app/config';
import type { Props } from 'lib/next/getServerSideProps';
import { getServerSideProps as getServerSidePropsBase } from 'lib/next/getServerSideProps';
import PageServer from 'lib/next/PageServer';
import Page from 'ui/shared/Page/Page';

const MarketplaceApp = dynamic(() => import('ui/pages/MarketplaceApp'), { ssr: false });

const MarketplaceAppPage: NextPage<Props> = (props: Props) => {
  return (
    <PageServer pathname="/apps/[id]" query={ props }>
      <Head><title>Blockscout | Marketplace</title></Head>
      <Page wrapChildren={ false }>
        <MarketplaceApp/>
      </Page>
    </PageServer>
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

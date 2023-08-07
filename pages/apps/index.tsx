import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';

const Marketplace = dynamic(() => import('ui/pages/Marketplace'), { ssr: false });

const MarketplacePage: NextPage = () => {
  return (
    <PageServer pathname="/apps">
      <Page>
        <PageTitle title="Marketplace"/>
        <Marketplace/>
      </Page>
    </PageServer>
  );
};

export default MarketplacePage;

export { marketplace as getServerSideProps } from 'lib/next/getServerSideProps';

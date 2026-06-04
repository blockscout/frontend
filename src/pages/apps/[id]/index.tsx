// SPDX-License-Identifier: LicenseRef-Blockscout

import dynamic from 'next/dynamic';
import type { Route } from 'nextjs-routes';
import React from 'react';

import type { NextPageWithLayout } from 'src/server/types';

import type { Props } from 'src/server/getServerSideProps/handlers';
import PageNextJs from 'src/server/PageNextJs';

import LayoutApp from 'src/shell/layout/LayoutApp';

const MarketplaceAppPage = dynamic(() => import('src/features/marketplace/pages/dapp/MarketplaceApp'), { ssr: false });

const pathname: Route['pathname'] = '/apps/[id]';

const Page: NextPageWithLayout<Props<typeof pathname>> = (props: Props<typeof pathname>) => {
  return (
    <PageNextJs pathname={ pathname } query={ props.query } apiData={ props.apiData }>
      <MarketplaceAppPage/>
    </PageNextJs>
  );
};

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <LayoutApp>
      { page }
    </LayoutApp>
  );
};

export default Page;

export { getServerSideProps } from 'src/server/getServerSideProps/routes/apps/id';

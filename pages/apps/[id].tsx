import dynamic from 'next/dynamic';
import React from 'react';

import type { NextPageWithLayout } from 'nextjs/types';

import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

import LayoutApp from 'ui/shared/layout/LayoutApp';

const MarketplaceApp = dynamic(() => import('ui/pages/MarketplaceApp'), { ssr: false });

const Page: NextPageWithLayout<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/apps/[id]" query={ props }>
      <MarketplaceApp/>
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

export { marketplace as getServerSideProps } from 'nextjs/getServerSideProps';

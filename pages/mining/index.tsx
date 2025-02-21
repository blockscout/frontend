import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const MarketplaceInMining = dynamic(() => import('ui/pages/MarketplaceInMining'), { ssr: false });
{
  /* <MarketplaceInMining /> */
}

const Page: NextPage = () => (
  <PageNextJs pathname="/mining">
    <div>测试网</div>
  </PageNextJs>
);

export default Page;

export { marketplace as getServerSideProps } from 'nextjs/getServerSideProps';

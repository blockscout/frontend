import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const MarketplaceInRace = dynamic(() => import('ui/pages/MarketplaceInRace'), { ssr: false });

const Page: NextPage = () => (
  <PageNextJs pathname="/race">
    <MarketplaceInRace />
  </PageNextJs>
);

export default Page;

export { marketplace as getServerSideProps } from 'nextjs/getServerSideProps';

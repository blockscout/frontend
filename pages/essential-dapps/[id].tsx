import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const MarketplaceEssentialDapp = dynamic(() => import('ui/pages/MarketplaceEssentialDapp'), { ssr: false });

const Page: NextPage = () => (
  <PageNextJs pathname="/essential-dapps/[id]">
    <MarketplaceEssentialDapp/>
  </PageNextJs>
);

export default Page;

export { marketplaceEssentialDapp as getServerSideProps } from 'nextjs/getServerSideProps/main';

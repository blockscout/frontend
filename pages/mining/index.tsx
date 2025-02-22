import type { NextPage } from 'next';
import React from 'react';
import dynamic from 'next/dynamic';
import PageNextJs from 'nextjs/PageNextJs';
const MarketplaceInMining = dynamic(() => import('ui/pages/MarketplaceInMining'), { ssr: false });

const Page: NextPage = () => (
  <PageNextJs pathname="/mining">
    <MarketplaceInMining />
  </PageNextJs>
);

export default Page;

// export { marketplace as getServerSideProps } from 'nextjs/getServerSideProps';
export async function getServerSideProps() {
  return { props: {} };
}

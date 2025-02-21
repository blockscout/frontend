import type { NextPage } from 'next';
import React from 'react';
import PageNextJs from 'nextjs/PageNextJs';
import MarketplaceInMining from 'ui/pages/MarketplaceInMining';

const Page: NextPage = () => (
  <PageNextJs pathname="/mining">
    <MarketplaceInMining />
  </PageNextJs>
);

export default Page;

// export { marketplace as getServerSideProps } from 'nextjs/getServerSideProps';

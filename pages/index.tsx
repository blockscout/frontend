import React from 'react';

import type { NextPageWithLayout } from 'nextjs/types';

import PageNextJs from 'nextjs/PageNextJs';

import multichainConfig from 'configs/multichain';
import Home from 'ui/pages/Home';
import HomeMultichain from 'ui/pages/HomeMultichain';
import LayoutHome from 'ui/shared/layout/LayoutHome';

const Page: NextPageWithLayout = () => {
  return (
    <PageNextJs pathname="/">
      { multichainConfig ? <HomeMultichain/> : <Home/> }
    </PageNextJs>
  );
};

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <LayoutHome>
      { page }
    </LayoutHome>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';

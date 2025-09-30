import React from 'react';

import type { NextPageWithLayout } from 'nextjs/types';

import PageNextJs from 'nextjs/PageNextJs';

import config from 'configs/app';
import OpSuperchainHome from 'ui/optimismSuperchain/home/OpSuperchainHome';
import Home from 'ui/pages/Home';
import LayoutHome from 'ui/shared/layout/LayoutHome';

const Page: NextPageWithLayout = () => {
  return (
    <PageNextJs pathname="/">
      { config.features.opSuperchain.isEnabled ? <OpSuperchainHome/> : <Home/> }
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

export { base as getServerSideProps } from 'nextjs/getServerSideProps/main';

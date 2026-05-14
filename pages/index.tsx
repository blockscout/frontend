// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { NextPageWithLayout } from 'nextjs/types';

import PageNextJs from 'nextjs/PageNextJs';

import Home from 'client/slices/home/pages/index/Home';

import config from 'configs/app';
import MultichainHome from 'ui/multichain/home/MultichainHome';
import LayoutHome from 'ui/shared/layout/LayoutHome';

const Page: NextPageWithLayout = () => {
  return (
    <PageNextJs pathname="/">
      { config.features.multichain.isEnabled ? <MultichainHome/> : <Home/> }
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

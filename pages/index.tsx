// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { NextPageWithLayout } from 'nextjs/types';

import PageNextJs from 'nextjs/PageNextJs';

import LayoutHome from 'client/shell/layout/LayoutHome';

import Home from 'client/slices/home/pages/index/Home';

import MultichainHome from 'client/features/multichain/pages/home/MultichainHome';

import config from 'client/config';

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

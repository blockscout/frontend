// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { NextPageWithLayout } from 'src/server/types';

import PageNextJs from 'src/server/PageNextJs';

import LayoutHome from 'src/shell/layout/LayoutHome';

import Home from 'src/slices/home/pages/index/Home';

import MultichainHome from 'src/features/multichain/pages/home/MultichainHome';

import config from 'src/config';

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

export { base as getServerSideProps } from 'src/server/getServerSideProps/main';

// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

const WatchList = dynamic(() => import('src/features/account/pages/watchlist/Watchlist'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/account/watchlist">
      <WatchList/>
    </PageNextJs>
  );
};

export default Page;

export { account as getServerSideProps } from 'src/server/getServerSideProps/main';

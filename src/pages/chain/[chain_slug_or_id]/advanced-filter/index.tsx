// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

import AdvancedFilter from 'src/features/advanced-filter/pages/index/AdvancedFilter';
import { MultichainProvider } from 'src/features/multichain/context';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/chain/[chain_slug_or_id]/advanced-filter">
      <MultichainProvider>
        <AdvancedFilter/>
      </MultichainProvider>
    </PageNextJs>
  );
};

export default Page;

export { advancedFilter as getServerSideProps } from 'src/server/getServerSideProps/multichain';

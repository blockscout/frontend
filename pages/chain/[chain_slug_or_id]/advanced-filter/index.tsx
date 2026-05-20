// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import AdvancedFilter from 'client/features/advanced-filter/pages/index/AdvancedFilter';

import { MultichainProvider } from 'lib/contexts/multichain';

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

export { advancedFilter as getServerSideProps } from 'nextjs/getServerSideProps/multichain';

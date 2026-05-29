// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

import AdvancedFilter from 'src/features/advanced-filter/pages/index/AdvancedFilter';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/advanced-filter">
      <AdvancedFilter/>
    </PageNextJs>
  );
};

export default Page;

export { advancedFilter as getServerSideProps } from 'src/server/getServerSideProps/main';

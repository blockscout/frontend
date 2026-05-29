// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

import DesignSystem from 'src/toolkit/pages/design-system/DesignSystem';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/chakra">
      <DesignSystem/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'src/server/getServerSideProps/main';

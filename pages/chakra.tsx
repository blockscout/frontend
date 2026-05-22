// SPDX-License-Identifier: LicenseRef-Blockscout

import DesignSystem from 'client/toolkit/pages/design-system/DesignSystem';
import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/chakra">
      <DesignSystem/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps/main';

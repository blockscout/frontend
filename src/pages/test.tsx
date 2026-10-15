// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

const TokenTransfersGridTest = dynamic(() => import('src/slices/token-transfer/pages/test/TokenTransfersGridTest'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/test">
      <TokenTransfersGridTest/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'src/server/getServerSideProps/main';

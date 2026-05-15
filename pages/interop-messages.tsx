// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const InteropMessages = dynamic(() => import('client/features/op-interop/pages/messages/InteropMessages'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/interop-messages">
      <InteropMessages/>
    </PageNextJs>
  );
};

export default Page;

export { interopMessages as getServerSideProps } from 'nextjs/getServerSideProps/main';

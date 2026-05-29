// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

const ApiKeys = dynamic(() => import('src/features/account/pages/api-keys/ApiKeys'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/account/api-key">
      <ApiKeys/>
    </PageNextJs>
  );
};

export default Page;

export { account as getServerSideProps } from 'src/server/getServerSideProps/main';

// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

const ApiDocs = dynamic(() => import('src/features/api-docs/pages/index/ApiDocs'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/api-docs">
      <ApiDocs/>
    </PageNextJs>
  );
};

export default Page;

export { apiDocs as getServerSideProps } from 'src/server/getServerSideProps/main';

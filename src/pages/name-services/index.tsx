// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

const NameServices = dynamic(() => import('src/features/name-services/common/pages/NameServices'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/name-services">
      <NameServices/>
    </PageNextJs>
  );
};

export default Page;

export { nameServices as getServerSideProps } from 'src/server/getServerSideProps/main';

// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

const PrivateTags = dynamic(() => import('src/features/account/pages/private-tags/PrivateTags'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/account/tag-address">
      <PrivateTags/>
    </PageNextJs>
  );
};

export default Page;

export { account as getServerSideProps } from 'src/server/getServerSideProps/main';

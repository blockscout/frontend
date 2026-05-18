// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const MudWorlds = dynamic(() => import('client/features/chain-variants/mud/pages/mud-worlds/MudWorlds'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/mud-worlds">
      <MudWorlds/>
    </PageNextJs>
  );
};

export default Page;

export { mud as getServerSideProps } from 'nextjs/getServerSideProps/main';

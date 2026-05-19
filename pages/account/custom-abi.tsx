// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const CustomAbi = dynamic(() => import('client/features/account/pages/custom-abi/CustomAbi'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/account/custom-abi">
      <CustomAbi/>
    </PageNextJs>
  );
};

export default Page;

export { account as getServerSideProps } from 'nextjs/getServerSideProps/main';

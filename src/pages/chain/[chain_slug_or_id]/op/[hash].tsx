// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'src/server/getServerSideProps/handlers';
import PageNextJs from 'src/server/PageNextJs';

import { MultichainProvider } from 'src/features/multichain/context';

const UserOp = dynamic(() => import('src/features/user-ops/pages/details/UserOp'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/chain/[chain_slug_or_id]/op/[hash]" query={ props.query }>
      <MultichainProvider>
        <UserOp/>
      </MultichainProvider>
    </PageNextJs>
  );
};

export default Page;

export { userOps as getServerSideProps } from 'src/server/getServerSideProps/multichain';

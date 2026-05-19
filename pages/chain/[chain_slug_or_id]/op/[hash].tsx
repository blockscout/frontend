// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps/handlers';
import PageNextJs from 'nextjs/PageNextJs';

import { MultichainProvider } from 'lib/contexts/multichain';

const UserOp = dynamic(() => import('client/features/user-ops/pages/details/UserOp'), { ssr: false });

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

export { userOps as getServerSideProps } from 'nextjs/getServerSideProps/multichain';

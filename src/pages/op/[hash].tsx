// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'src/server/getServerSideProps/handlers';
import PageNextJs from 'src/server/PageNextJs';

const UserOp = dynamic(() => import('src/features/user-ops/pages/details/UserOp'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/op/[hash]" query={ props.query }>
      <UserOp/>
    </PageNextJs>
  );
};

export default Page;

export { userOps as getServerSideProps } from 'src/server/getServerSideProps/main';

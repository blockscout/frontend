// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'src/server/getServerSideProps/handlers';
import PageNextJs from 'src/server/PageNextJs';

const Epoch = dynamic(() => import('src/features/chain-variants/celo/pages/epoch-details/Epoch'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/epochs/[number]" query={ props.query }>
      <Epoch/>
    </PageNextJs>
  );
};

export default Page;

export { celo as getServerSideProps } from 'src/server/getServerSideProps/main';

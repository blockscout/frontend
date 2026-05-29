// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'src/server/getServerSideProps/handlers';
import PageNextJs from 'src/server/PageNextJs';

const TacOperation = dynamic(() => import('src/features/chain-variants/tac/pages/operation-details/TacOperation'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/operation/[id]" query={ props.query }>
      <TacOperation/>
    </PageNextJs>
  );
};

export default Page;

export { tac as getServerSideProps } from 'src/server/getServerSideProps/main';

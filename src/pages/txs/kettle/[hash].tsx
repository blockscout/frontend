// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'src/server/getServerSideProps/handlers';
import PageNextJs from 'src/server/PageNextJs';

const KettleTxs = dynamic(() => import('src/features/chain-variants/suave/pages/kettle/KettleTxs'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/txs/kettle/[hash]" query={ props.query }>
      <KettleTxs/>
    </PageNextJs>
  );
};

export default Page;

export { suave as getServerSideProps } from 'src/server/getServerSideProps/main';

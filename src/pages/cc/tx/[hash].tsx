// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'src/server/getServerSideProps/handlers';
import PageNextJs from 'src/server/PageNextJs';

const ZetaChainCCTX = dynamic(() => import('src/features/chain-variants/zeta-chain/pages/cctx-details/ZetaChainCCTX'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/cc/tx/[hash]" query={ props.query }>
      <ZetaChainCCTX/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'src/server/getServerSideProps/main';

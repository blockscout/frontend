// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'src/server/getServerSideProps/handlers';
import PageNextJs from 'src/server/PageNextJs';

const BlockCountdownIndex = dynamic(() => import('src/slices/block/pages/countdown-index/BlockCountdownIndex'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/block/countdown" query={ props.query }>
      <BlockCountdownIndex/>
    </PageNextJs>
  );
};

export default Page;

export { block as getServerSideProps } from 'src/server/getServerSideProps/main';

// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'src/server/getServerSideProps/handlers';
import PageNextJs from 'src/server/PageNextJs';

const BlockCountdown = dynamic(() => import('src/slices/block/pages/countdown-details/BlockCountdown'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/block/countdown/[height]" query={ props.query }>
      <BlockCountdown/>
    </PageNextJs>
  );
};

export default Page;

export { block as getServerSideProps } from 'src/server/getServerSideProps/main';

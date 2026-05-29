// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'src/server/getServerSideProps/handlers';
import PageNextJs from 'src/server/PageNextJs';

const Block = dynamic(() => import('src/slices/block/pages/details/Block'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/block/[height_or_hash]" query={ props.query }>
      <Block/>
    </PageNextJs>
  );
};

export default Page;

export { block as getServerSideProps } from 'src/server/getServerSideProps/main';

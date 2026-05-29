// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'src/server/getServerSideProps/handlers';
import PageNextJs from 'src/server/PageNextJs';

const Pool = dynamic(() => import('src/features/dex-pools/pages/details/Pool'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/pools/[hash]" query={ props.query }>
      <Pool/>
    </PageNextJs>
  );
};

export default Page;

export { pools as getServerSideProps } from 'src/server/getServerSideProps/main';

// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'src/server/getServerSideProps/handlers';
import PageNextJs from 'src/server/PageNextJs';

const Transaction = dynamic(() => {
  return import('src/slices/tx/pages/details/Transaction');
}, { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/tx/[hash]" query={ props.query }>
      <Transaction/>
    </PageNextJs>
  );
};

export default Page;

export { tx as getServerSideProps } from 'src/server/getServerSideProps/main';

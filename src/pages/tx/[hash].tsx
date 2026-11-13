// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'src/server/getServerSideProps/handlers';
import PageNextJs from 'src/server/PageNextJs';

import type { Route } from 'src/shared/router/routes';

const pathname: Route['pathname'] = '/tx/[hash]';

const Transaction = dynamic(() => {
  return import('src/slices/tx/pages/details/Transaction');
}, { ssr: false });

const Page: NextPage<Props<typeof pathname>> = (props: Props<typeof pathname>) => {
  return (
    <PageNextJs pathname={ pathname } query={ props.query } apiData={ props.apiData }>
      <Transaction/>
    </PageNextJs>
  );
};

export default Page;

export { getServerSideProps } from 'src/server/getServerSideProps/routes/tx/hash';

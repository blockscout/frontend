// SPDX-License-Identifier: LicenseRef-Blockscout

import dynamic from 'next/dynamic';
import React from 'react';

import type { NextPageWithLayout } from 'src/server/types';

import type { Props } from 'src/server/getServerSideProps/handlers';
import PageNextJs from 'src/server/PageNextJs';

import LayoutBare from 'src/shell/layout/LayoutBare';

import type { Route } from 'src/shared/router/routes';

const pathname: Route['pathname'] = '/tx/[hash]/receipt';

const TxReceipt = dynamic(() => import('src/slices/tx/pages/receipt/TxReceipt'), { ssr: false });

const Page: NextPageWithLayout<Props<typeof pathname>> = (props: Props<typeof pathname>) => {
  return (
    <PageNextJs pathname={ pathname } query={ props.query } apiData={ props.apiData }>
      <TxReceipt/>
    </PageNextJs>
  );
};

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <LayoutBare>
      { page }
    </LayoutBare>
  );
};

export default Page;

export { getServerSideProps } from 'src/server/getServerSideProps/routes/tx/hash';

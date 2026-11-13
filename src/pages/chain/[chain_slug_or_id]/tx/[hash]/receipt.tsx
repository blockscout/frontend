// SPDX-License-Identifier: LicenseRef-Blockscout

import dynamic from 'next/dynamic';
import React from 'react';

import type { NextPageWithLayout } from 'src/server/types';

import type { Props } from 'src/server/getServerSideProps/handlers';
import PageNextJs from 'src/server/PageNextJs';

import LayoutBare from 'src/shell/layout/LayoutBare';

import type { Route } from 'src/shared/router/routes';

const pathname: Route['pathname'] = '/chain/[chain_slug_or_id]/tx/[hash]/receipt';

const MultichainTxReceipt = dynamic(() => import('src/features/multichain/pages/tx-receipt/MultichainTxReceipt'), { ssr: false });

const Page: NextPageWithLayout<Props<typeof pathname>> = (props: Props<typeof pathname>) => {
  return (
    <PageNextJs pathname={ pathname } query={ props.query }>
      <MultichainTxReceipt/>
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

export { base as getServerSideProps } from 'src/server/getServerSideProps/multichain';

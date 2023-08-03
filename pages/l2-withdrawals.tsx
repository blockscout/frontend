import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import Page from 'ui/shared/Page/Page';

const L2Withdrawals = dynamic(() => import('ui/pages/L2Withdrawals'), { ssr: false });

const WithdrawalsPage: NextPage = () => {
  return (
    <PageServer pathname="/l2-withdrawals">
      <Page>
        <L2Withdrawals/>
      </Page>
    </PageServer>
  );
};

export default WithdrawalsPage;

export { L2 as getServerSideProps } from 'lib/next/getServerSideProps';

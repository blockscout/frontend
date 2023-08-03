import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import Page from 'ui/shared/Page/Page';

const Withdrawals = dynamic(() => import('ui/pages/Withdrawals'), { ssr: false });

const WithdrawalsPage: NextPage = () => {
  return (
    <PageServer pathname="/withdrawals">
      <Page>
        <Withdrawals/>
      </Page>
    </PageServer>
  );
};

export default WithdrawalsPage;

export { getServerSideProps } from 'lib/next/getServerSidePropsBeacon';

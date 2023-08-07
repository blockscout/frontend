import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import Page from 'ui/shared/Page/Page';

const L2Deposits = dynamic(() => import('ui/pages/L2Deposits'), { ssr: false });

const DepositsPage: NextPage = () => {
  return (
    <PageServer pathname="/l2-deposits">
      <Page>
        <L2Deposits/>
      </Page>
    </PageServer>
  );
};

export default DepositsPage;

export { L2 as getServerSideProps } from 'lib/next/getServerSideProps';

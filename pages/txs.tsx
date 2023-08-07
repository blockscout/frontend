import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import Page from 'ui/shared/Page/Page';

const Transactions = dynamic(() => import('ui/pages/Transactions'), { ssr: false });

const TxsPage: NextPage = () => {
  return (
    <PageServer pathname="/txs">
      <Page>
        <Transactions/>
      </Page>
    </PageServer>
  );
};

export default TxsPage;

export { base as getServerSideProps } from 'lib/next/getServerSideProps';

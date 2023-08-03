import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import type { RoutedQuery } from 'nextjs-routes';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import Page from 'ui/shared/Page/Page';

const Transaction = dynamic(() => import('ui/pages/Transaction'), { ssr: false });

const TransactionPage: NextPage<RoutedQuery<'/tx/[hash]'>> = (query: RoutedQuery<'/tx/[hash]'>) => {
  return (
    <PageServer pathname="/tx/[hash]" query={ query }>
      <Page>
        <Transaction/>
      </Page>
    </PageServer>
  );
};

export default TransactionPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

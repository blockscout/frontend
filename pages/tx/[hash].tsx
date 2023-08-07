import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'lib/next/getServerSideProps';
import PageServer from 'lib/next/PageServer';
import Page from 'ui/shared/Page/Page';

const Transaction = dynamic(() => import('ui/pages/Transaction'), { ssr: false });

const TransactionPage: NextPage<Props> = (props: Props) => {
  return (
    <PageServer pathname="/tx/[hash]" query={ props }>
      <Page>
        <Transaction/>
      </Page>
    </PageServer>
  );
};

export default TransactionPage;

export { base as getServerSideProps } from 'lib/next/getServerSideProps';

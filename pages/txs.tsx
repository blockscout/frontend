import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';

const Transactions = dynamic(() => import('ui/pages/Transactions'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageServer pathname="/txs">
      <Transactions/>
    </PageServer>
  );
};

export default Page;

export { base as getServerSideProps } from 'lib/next/getServerSideProps';

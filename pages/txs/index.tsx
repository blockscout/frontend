import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import config from 'configs/app';

import PageNextJs from 'nextjs/PageNextJs';

const zetachainFeature = config.features.zetachain;

const Transactions = dynamic(() => import('ui/pages/Transactions'), { ssr: false });
const TransactionsZetaChain = dynamic(() => import('ui/pages/TransactionsZetaChain'), { ssr: false });

const Page: NextPage = () => {
  if (zetachainFeature) {
    return (
      <PageNextJs pathname="/txs">
        <TransactionsZetaChain/>
      </PageNextJs>
    );
  }

  return (
    <PageNextJs pathname="/txs">
      <Transactions/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';

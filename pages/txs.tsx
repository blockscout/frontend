import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const Transactions = dynamic(() => import('ui/pages/Transactions'), { ssr: false });

const Page: NextPage = () => {
  return (
    <div>
      <PageNextJs pathname="/txs">
        <Transactions/>
      </PageNextJs>
    </div>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';

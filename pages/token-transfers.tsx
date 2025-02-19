import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const TokenTransfers = dynamic(() => import('ui/pages/TokenTransfers'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/token-transfers">
      <TokenTransfers/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';

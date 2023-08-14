import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';

const L2Withdrawals = dynamic(() => import('ui/pages/L2Withdrawals'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageServer pathname="/l2-withdrawals">
      <L2Withdrawals/>
    </PageServer>
  );
};

export default Page;

export { L2 as getServerSideProps } from 'lib/next/getServerSideProps';

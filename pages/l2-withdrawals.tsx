import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const L2Withdrawals = dynamic(() => import('ui/pages/L2Withdrawals'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/l2-withdrawals">
      <L2Withdrawals/>
    </PageNextJs>
  );
};

export default Page;

export { L2 as getServerSideProps } from 'nextjs/getServerSideProps';

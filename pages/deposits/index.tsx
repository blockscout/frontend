import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const Deposits = dynamic(() => import('ui/pages/OptimisticL2Deposits'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/deposits">
      <Deposits/>
    </PageNextJs>
  );
};

export default Page;

export { optimisticRollup as getServerSideProps } from 'nextjs/getServerSideProps';

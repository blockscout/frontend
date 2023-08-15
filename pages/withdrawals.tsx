import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const Withdrawals = dynamic(() => import('ui/pages/Withdrawals'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/withdrawals">
      <Withdrawals/>
    </PageNextJs>
  );
};

export default Page;

export { beaconChain as getServerSideProps } from 'nextjs/getServerSideProps';

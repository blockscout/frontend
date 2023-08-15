import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'nextjs/PageServer';

const Withdrawals = dynamic(() => import('ui/pages/Withdrawals'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageServer pathname="/withdrawals">
      <Withdrawals/>
    </PageServer>
  );
};

export default Page;

export { beaconChain as getServerSideProps } from 'nextjs/getServerSideProps';

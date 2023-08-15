import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'nextjs/PageServer';

const L2Deposits = dynamic(() => import('ui/pages/L2Deposits'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageServer pathname="/l2-deposits">
      <L2Deposits/>
    </PageServer>
  );
};

export default Page;

export { L2 as getServerSideProps } from 'nextjs/getServerSideProps';

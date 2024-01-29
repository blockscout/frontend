import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const Outputs = dynamic(() => import('ui/pages/L2OutputRoots'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/outputs">
      <Outputs/>
    </PageNextJs>
  );
};

export default Page;

export { optimisticRollup as getServerSideProps } from 'nextjs/getServerSideProps';

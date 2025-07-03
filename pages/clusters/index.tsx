import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const Clusters = dynamic(() => import('ui/pages/Clusters'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/clusters">
      <Clusters/>
    </PageNextJs>
  );
};

export default Page;

export { clusters as getServerSideProps } from 'nextjs/getServerSideProps';

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const L2OutputRoots = dynamic(() => import('ui/pages/L2OutputRoots'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/l2-output-roots">
      <L2OutputRoots/>
    </PageNextJs>
  );
};

export default Page;

export { L2 as getServerSideProps } from 'nextjs/getServerSideProps';

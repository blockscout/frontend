import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const Blocks = dynamic(() => import('ui/pages/Blocks'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/blocks">
      <Blocks/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';

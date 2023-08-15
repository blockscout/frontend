import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'nextjs/PageServer';

const Blocks = dynamic(() => import('ui/pages/Blocks'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageServer pathname="/blocks">
      <Blocks/>
    </PageServer>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';

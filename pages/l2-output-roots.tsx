import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';

const L2OutputRoots = dynamic(() => import('ui/pages/L2OutputRoots'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageServer pathname="/l2-output-roots">
      <L2OutputRoots/>
    </PageServer>
  );
};

export default Page;

export { L2 as getServerSideProps } from 'lib/next/getServerSideProps';

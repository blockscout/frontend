import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

const ComputorTxs = dynamic(() => import('ui/pages/ComputorTxs'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/txs/computor/[hash]" query={ props }>
      <ComputorTxs/>
    </PageNextJs>
  );
};

export default Page;

export { suave as getServerSideProps } from 'nextjs/getServerSideProps';

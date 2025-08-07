import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

const Cluster = dynamic(() => import('ui/pages/Cluster'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/clusters/[name]" query={ props.query }>
      <Cluster/>
    </PageNextJs>
  );
};

export default Page;

export { clusters as getServerSideProps } from 'nextjs/getServerSideProps';

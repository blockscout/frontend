import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

const Threads = dynamic(() => import('ui/pages/Threads'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/forum/[topic]" query={ props }>
      <Threads/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';

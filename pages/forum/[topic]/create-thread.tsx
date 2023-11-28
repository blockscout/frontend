import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

const CreateThread = dynamic(() => import('ui/pages/CreateThread'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/forum/[topic]/create-thread" query={ props }>
      <CreateThread/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';

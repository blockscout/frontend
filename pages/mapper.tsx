import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import config from 'configs/app';

import '@moonchain/react-mapper/style.css';

const Mapper = dynamic(() => import('@moonchain/react-mapper'), { ssr: false });

const Page: NextPage = () => {
  const router = useRouter();
  return (
    <PageNextJs pathname="/mapper">
      <Mapper query={ router.query } chain={ config.chain.id! }/>
    </PageNextJs>
  );
};

export default Page;

export { stats as getServerSideProps } from 'nextjs/getServerSideProps';

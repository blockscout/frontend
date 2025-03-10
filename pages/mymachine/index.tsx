import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';
const MyMachine = dynamic(() => import('ui/mymachine/index'), { ssr: false });

const Page: NextPage = () => (
  <PageNextJs pathname="/mymachine">
    <MyMachine />
  </PageNextJs>
);

export default Page;

export async function getServerSideProps() {
  return { props: {} };
}

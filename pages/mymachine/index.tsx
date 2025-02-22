import type { NextPage } from 'next';
import React from 'react';
import PageNextJs from 'nextjs/PageNextJs';
import dynamic from 'next/dynamic';
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

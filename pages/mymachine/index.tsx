import type { NextPage } from 'next';
import React from 'react';
import PageNextJs from 'nextjs/PageNextJs';
import MyMachine from 'ui/mymachine/index';

const Page: NextPage = () => (
  <PageNextJs pathname="/mymachine">
    <MyMachine />
  </PageNextJs>
);

export default Page;

// export { marketplace as getServerSideProps } from 'nextjs/getServerSideProps';

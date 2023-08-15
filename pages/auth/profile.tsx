import type { NextPage } from 'next';
import React from 'react';

import PageServer from 'nextjs/PageServer';

import MyProfile from 'ui/pages/MyProfile';

const Page: NextPage = () => {
  return (
    <PageServer pathname="/auth/profile">
      <MyProfile/>
    </PageServer>
  );
};

export default Page;

export { account as getServerSideProps } from 'nextjs/getServerSideProps';

import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import MyProfile from 'ui/pages/MyProfile';

const MyProfilePage: NextPage = () => {
  return (
    <>
      <Head><title>My profile</title></Head>
      <MyProfile/>
    </>
  );
};

export default MyProfilePage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

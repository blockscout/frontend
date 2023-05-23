import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import MyProfile from 'ui/pages/MyProfile';
import Page from 'ui/shared/Page/Page';

const MyProfilePage: NextPage = () => {
  return (
    <>
      <Head><title>My profile</title></Head>
      <Page>
        <MyProfile/>
      </Page>
    </>
  );
};

export default MyProfilePage;

export { getServerSideProps } from 'lib/next/account/getServerSideProps';

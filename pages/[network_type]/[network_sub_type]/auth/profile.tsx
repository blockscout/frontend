import type { NextPage, GetStaticPaths } from 'next';
import Head from 'next/head';
import React from 'react';

import getAvailablePaths from 'lib/networks/getAvailablePaths';
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

export const getStaticPaths: GetStaticPaths = async() => {
  return { paths: getAvailablePaths(), fallback: false };
};

export const getStaticProps = async() => {
  return {
    props: {},
  };
};

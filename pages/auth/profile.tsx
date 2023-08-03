import type { NextPage } from 'next';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import MyProfile from 'ui/pages/MyProfile';
import Page from 'ui/shared/Page/Page';

const MyProfilePage: NextPage = () => {
  return (
    <PageServer pathname="/auth/profile">
      <Page>
        <MyProfile/>
      </Page>
    </PageServer>
  );
};

export default MyProfilePage;

export { getServerSideProps } from 'lib/next/getServerSidePropsAccount';

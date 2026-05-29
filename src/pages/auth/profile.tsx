// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

import MyProfile from 'src/features/account/pages/profile/MyProfile';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/auth/profile">
      <MyProfile/>
    </PageNextJs>
  );
};

export default Page;

export { accountAuth0 as getServerSideProps } from 'src/server/getServerSideProps/main';

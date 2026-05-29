// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

import Login from 'src/features/account/pages/login/Login';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/login">
      <Login/>
    </PageNextJs>
  );
};

export default Page;

export { login as getServerSideProps } from 'src/server/getServerSideProps/main';

// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

import Sprite from 'src/sprite/pages/Sprite';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/sprite">
      <Sprite/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'src/server/getServerSideProps/main';

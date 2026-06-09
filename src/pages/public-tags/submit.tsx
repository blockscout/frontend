// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

import TagSubmition from 'src/features/address-metadata/pages/tag-submition/TagSubmition';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/public-tags/submit">
      <TagSubmition/>
    </PageNextJs>
  );
};

export default Page;

export { publicTagsSubmit as getServerSideProps } from 'src/server/getServerSideProps/main';

// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import TagSubmition from 'client/features/address-metadata/pages/tag-submition/TagSubmition';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/public-tags/submit">
      <TagSubmition/>
    </PageNextJs>
  );
};

export default Page;

export { publicTagsSubmit as getServerSideProps } from 'nextjs/getServerSideProps/main';

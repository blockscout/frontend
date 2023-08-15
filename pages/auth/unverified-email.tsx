import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import UnverifiedEmail from 'ui/pages/UnverifiedEmail';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/auth/unverified-email">
      <UnverifiedEmail/>
    </PageNextJs>
  );
};

export default Page;

export { account as getServerSideProps } from 'nextjs/getServerSideProps';

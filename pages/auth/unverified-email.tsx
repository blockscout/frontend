import type { NextPage } from 'next';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import UnverifiedEmail from 'ui/pages/UnverifiedEmail';

const Page: NextPage = () => {
  return (
    <PageServer pathname="/auth/unverified-email">
      <UnverifiedEmail/>
    </PageServer>
  );
};

export default Page;

export { account as getServerSideProps } from 'lib/next/getServerSideProps';

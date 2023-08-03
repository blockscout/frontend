import type { NextPage } from 'next';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import UnverifiedEmail from 'ui/pages/UnverifiedEmail';
import Page from 'ui/shared/Page/Page';

const UnverifiedEmailPage: NextPage = () => {
  return (
    <PageServer pathname="/auth/unverified-email">
      <Page>
        <UnverifiedEmail/>
      </Page>
    </PageServer>
  );
};

export default UnverifiedEmailPage;

export { account as getServerSideProps } from 'lib/next/getServerSideProps';

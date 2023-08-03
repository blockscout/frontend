import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import Page from 'ui/shared/Page/Page';

const Tokens = dynamic(() => import('ui/pages/Tokens'), { ssr: false });

const TokensPage: NextPage = () => {
  return (
    <PageServer pathname="/tokens">
      <Page>
        <Tokens/>
      </Page>
    </PageServer>
  );
};

export default TokensPage;

export { base as getServerSideProps } from 'lib/next/getServerSideProps';

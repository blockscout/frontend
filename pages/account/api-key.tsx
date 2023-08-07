import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import Page from 'ui/shared/Page/Page';

const ApiKeys = dynamic(() => import('ui/pages/ApiKeys'), { ssr: false });

const ApiKeysPage: NextPage = () => {
  return (
    <PageServer pathname="/account/api-key">
      <Page>
        <ApiKeys/>
      </Page>
    </PageServer>
  );
};

export default ApiKeysPage;

export { account as getServerSideProps } from 'lib/next/getServerSideProps';

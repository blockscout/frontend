import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import Page from 'ui/shared/Page/Page';

const Blocks = dynamic(() => import('ui/pages/Blocks'), { ssr: false });

const BlockPage: NextPage = () => {
  return (
    <PageServer pathname="/blocks">
      <Page>
        <Blocks/>
      </Page>
    </PageServer>
  );
};

export default BlockPage;

export { base as getServerSideProps } from 'lib/next/getServerSideProps';

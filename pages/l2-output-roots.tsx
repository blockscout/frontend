import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import Page from 'ui/shared/Page/Page';

const L2OutputRoots = dynamic(() => import('ui/pages/L2OutputRoots'), { ssr: false });

const OutputRootsPage: NextPage = () => {
  return (
    <PageServer pathname="/l2-output-roots">
      <Page>
        <L2OutputRoots/>
      </Page>
    </PageServer>
  );
};

export default OutputRootsPage;

export { L2 as getServerSideProps } from 'lib/next/getServerSideProps';

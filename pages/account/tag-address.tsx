import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import Page from 'ui/shared/Page/Page';

const PrivateTags = dynamic(() => import('ui/pages/PrivateTags'), { ssr: false });

const PrivateTagsPage: NextPage = () => {
  return (
    <PageServer pathname="/account/tag-address">
      <Page>
        <PrivateTags/>
      </Page>
    </PageServer>
  );
};

export default PrivateTagsPage;

export { account as getServerSideProps } from 'lib/next/getServerSideProps';

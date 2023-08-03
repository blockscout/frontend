import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import Page from 'ui/shared/Page/Page';

const PublicTags = dynamic(() => import('ui/pages/PublicTags'), { ssr: false });

const PublicTagsPage: NextPage = () => {
  return (
    <PageServer pathname="/account/public-tags-request">
      <Page>
        <PublicTags/>
      </Page>
    </PageServer>
  );
};

export default PublicTagsPage;

export { account as getServerSideProps } from 'lib/next/getServerSideProps';

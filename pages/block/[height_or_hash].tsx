import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'lib/next/getServerSideProps';
import PageServer from 'lib/next/PageServer';
import Page from 'ui/shared/Page/Page';

const Block = dynamic(() => import('ui/pages/Block'), { ssr: false });

const BlockPage: NextPage<Props> = (props: Props) => {
  return (
    <PageServer pathname="/block/[height_or_hash]" query={ props }>
      <Page>
        <Block/>
      </Page>
    </PageServer>
  );
};

export default BlockPage;

export { base as getServerSideProps } from 'lib/next/getServerSideProps';

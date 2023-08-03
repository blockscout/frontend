import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'lib/next/getServerSideProps';
import PageServer from 'lib/next/PageServer';
import Page from 'ui/shared/Page/Page';

const TokenInstance = dynamic(() => import('ui/pages/TokenInstance'), { ssr: false });

const TokenInstancePage: NextPage<Props> = (props: Props) => {
  return (
    <PageServer pathname="/token/[hash]/instance/[id]" query={ props }>
      <Page>
        <TokenInstance/>
      </Page>
    </PageServer>
  );
};

export default TokenInstancePage;

export { base as getServerSideProps } from 'lib/next/getServerSideProps';

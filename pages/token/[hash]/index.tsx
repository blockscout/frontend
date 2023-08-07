import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'lib/next/getServerSideProps';
import PageServer from 'lib/next/PageServer';
import Page from 'ui/shared/Page/Page';

const Token = dynamic(() => import('ui/pages/Token'), { ssr: false });

const TokenPage: NextPage<Props> = (props: Props) => {
  return (
    <PageServer pathname="/token/[hash]" query={ props }>
      <Page>
        <Token/>
      </Page>
    </PageServer>
  );
};

export default TokenPage;

export { base as getServerSideProps } from 'lib/next/getServerSideProps';

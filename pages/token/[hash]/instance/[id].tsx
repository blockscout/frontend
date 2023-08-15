import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import PageServer from 'nextjs/PageServer';

const TokenInstance = dynamic(() => import('ui/pages/TokenInstance'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageServer pathname="/token/[hash]/instance/[id]" query={ props }>
      <TokenInstance/>
    </PageServer>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';

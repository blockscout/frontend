import type { NextPage } from 'next';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps/handlers';
import PageNextJs from 'nextjs/PageNextJs';

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/tx/[hash]" query={ props.query }>
      Coming soon
    </PageNextJs>
  );
};

export default Page;

export { crossChainTxs as getServerSideProps } from 'nextjs/getServerSideProps/main';

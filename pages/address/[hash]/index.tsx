import type { NextPage } from 'next';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

import Address from 'ui/pages/Address';

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/address/[hash]" query={ props }>
      <Address/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';

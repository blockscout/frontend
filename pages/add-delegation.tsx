import type { NextPage } from 'next';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

import AddDelegation from 'ui/pages/AddDelegation';

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/add-delegation" query={ props.query }>
      <AddDelegation/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';

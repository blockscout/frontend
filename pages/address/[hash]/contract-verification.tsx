import type { NextPage } from 'next';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import PageServer from 'nextjs/PageServer';

import ContractVerification from 'ui/pages/ContractVerification';

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageServer pathname="/address/[hash]/contract-verification" query={ props }>
      <ContractVerification/>
    </PageServer>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';

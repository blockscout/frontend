import type { NextPage } from 'next';
import React from 'react';

import type { Props } from 'lib/next/getServerSideProps';
import PageServer from 'lib/next/PageServer';
import ContractVerification from 'ui/pages/ContractVerification';

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageServer pathname="/address/[hash]/contract-verification" query={ props }>
      <ContractVerification/>
    </PageServer>
  );
};

export default Page;

export { base as getServerSideProps } from 'lib/next/getServerSideProps';

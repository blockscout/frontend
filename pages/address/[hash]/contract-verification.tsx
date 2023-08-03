import type { NextPage } from 'next';
import React from 'react';

import type { Props } from 'lib/next/getServerSideProps';
import PageServer from 'lib/next/PageServer';
import ContractVerification from 'ui/pages/ContractVerification';
import Page from 'ui/shared/Page/Page';

const ContractVerificationPage: NextPage<Props> = (props: Props) => {
  return (
    <PageServer pathname="/address/[hash]/contract-verification" query={ props }>
      <Page>
        <ContractVerification/>
      </Page>
    </PageServer>
  );
};

export default ContractVerificationPage;

export { base as getServerSideProps } from 'lib/next/getServerSideProps';

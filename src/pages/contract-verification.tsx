// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import React from 'react';

import type { Props } from 'src/server/getServerSideProps/handlers';
import PageNextJs from 'src/server/PageNextJs';

import ContractVerification from 'src/slices/contract/pages/contract-verification/ContractVerification';

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/contract-verification" query={ props.query }>
      <ContractVerification/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'src/server/getServerSideProps/main';

// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import React from 'react';

import type { Props } from 'src/server/getServerSideProps/handlers';
import PageNextJs from 'src/server/PageNextJs';

import ContractVerificationForAddress from 'src/slices/contract/pages/contract-verification/ContractVerificationForAddress';

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/address/[hash]/contract-verification" query={ props.query }>
      <ContractVerificationForAddress/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'src/server/getServerSideProps/main';

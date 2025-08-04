import type { NextPage } from 'next';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

import AccountBalanceChecker from 'ui/pages/AccountBalanceChecker';

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/account-balance-checker" query={ props.query }>
      <AccountBalanceChecker/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';

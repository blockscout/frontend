import type { NextPage } from 'next';
import Head from 'next/head';
import type { RoutedQuery } from 'nextjs-routes';
import React from 'react';

import getSeo from 'lib/next/address/getSeo';
import ContractVerification from 'ui/pages/ContractVerification';

const ContractVerificationPage: NextPage<RoutedQuery<'/address/[hash]/contract_verification'>> =
({ hash }: RoutedQuery<'/address/[hash]/contract_verification'>) => {
  const { title, description } = getSeo({ hash });

  return (
    <>
      <Head>
        <title>{ title }</title>
        <meta name="description" content={ description }/>
      </Head>
      <ContractVerification/>
    </>
  );
};

export default ContractVerificationPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

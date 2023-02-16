import type { NextPage } from 'next';
import Head from 'next/head';
import type { RoutedQuery } from 'nextjs-routes';
import React from 'react';

import getSeo from 'lib/next/address/getSeo';
import Address from 'ui/pages/Address';

const AddressPage: NextPage<RoutedQuery<'/address/[hash]'>> = ({ hash }: RoutedQuery<'/address/[hash]'>) => {
  const { title, description } = getSeo({ hash });

  return (
    <>
      <Head>
        <title>{ title }</title>
        <meta name="description" content={ description }/>
      </Head>
      <Address/>
    </>
  );
};

export default AddressPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

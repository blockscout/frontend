import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import type { RoutedQuery } from 'nextjs-routes';
import React from 'react';

import getSeo from 'lib/next/address/getSeo';
import Page from 'ui/shared/Page/Page';

const Address = dynamic(() => import('ui/pages/Address'), { ssr: false });

const AddressPage: NextPage<RoutedQuery<'/address/[hash]'>> = ({ hash }: RoutedQuery<'/address/[hash]'>) => {
  const { title, description } = getSeo({ hash });

  return (
    <>
      <Head>
        <title>{ title }</title>
        <meta name="description" content={ description }/>
      </Head>
      <Page>
        <Address/>
      </Page>
    </>
  );
};

export default AddressPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';

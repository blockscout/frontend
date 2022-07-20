import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head'

import fetch from 'api/utils/fetch';

import PrivateTags from 'ui/pages/PrivateTags';

export async function getServerSideProps() {
  const response = await fetch('/account/v1/user/tags/address')
  const data = await response.json()

  return { props: { data } }
}

const PrivateTagsPage: NextPage = () => {
  return (
    <>
      <Head><title>Private tags</title></Head>
      <PrivateTags/>
    </>
  );
}

export default PrivateTagsPage

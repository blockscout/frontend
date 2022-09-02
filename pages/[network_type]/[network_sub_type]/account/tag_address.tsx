import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import PrivateTags from 'ui/pages/PrivateTags';

const AddressTagsPage: NextPage = () => {
  return (
    <>
      <Head><title>Public tags</title></Head>
      <PrivateTags tab="address"/>
    </>
  );
};

export default AddressTagsPage;

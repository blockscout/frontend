import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useCallback, useState } from 'react';

import PrivateTags from 'ui/pages/PrivateTags';

const TABS = [ 'address', 'transaction' ];

const PrivateTagsPage: NextPage = () => {
  const [ , setActiveTab ] = useState(TABS[0]);
  const onChangeTab = useCallback((index: number) => {
    setActiveTab(TABS[index]);
  }, [ setActiveTab ]);

  return (
    <>
      <Head><title>Private tags</title></Head>
      <PrivateTags onChangeTab={ onChangeTab }/>
    </>
  );
};

export default PrivateTagsPage;

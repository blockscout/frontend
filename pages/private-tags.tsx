import { useQuery } from '@tanstack/react-query';
import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useCallback, useState } from 'react';

import PrivateTags from 'ui/pages/PrivateTags';

const TABS = [ 'address', 'transaction' ];

const PrivateTagsPage: NextPage = () => {
  const [ activeTab, setActiveTab ] = useState(TABS[0]);
  const onChangeTab = useCallback((index: number) => {
    setActiveTab(TABS[index]);
  }, [ setActiveTab ]);

  // eslint-disable-next-line no-console
  console.log(activeTab);

  // FIXME: request data only for active tab and only once
  // don't refetch after tab change
  useQuery([ 'address' ], async() => {
    const response = await fetch('/api/account/private-tags/address');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });

  useQuery([ 'transaction' ], async() => {
    const response = await fetch('/api/account/private-tags/transaction');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });

  return (
    <>
      <Head><title>Private tags</title></Head>
      <PrivateTags onChangeTab={ onChangeTab }/>
    </>
  );
};

export default PrivateTagsPage;

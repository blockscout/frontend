/* eslint-disable */
"use client";

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import PageNextJs from 'nextjs/PageNextJs';
import Web3ModalProvider from 'ui/staking/Web3Provider';


const MainPage = dynamic(() => import('ui/staking/MainPage'), { ssr: false });


const ObjectDetails: NextPage = () => {

  return (
    <PageNextJs pathname="/my-staking">
      <Web3ModalProvider>
        <MainPage />
      </Web3ModalProvider>
    </PageNextJs>
  );
};

export default React.memo(ObjectDetails);

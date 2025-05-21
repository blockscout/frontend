/* eslint-disable */
"use client";


import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import PageNextJs from 'nextjs/PageNextJs';
import Web3ModalProvider from 'ui/staking/Web3Provider';


const MainPage = dynamic(() => import('ui/validators/MainPage'), { ssr: false });

const AllValidatorPage: NextPage = () => {

  return (
    <PageNextJs pathname="/all-validators">
      <Web3ModalProvider>
        <MainPage />
      </Web3ModalProvider>
    </PageNextJs>
  );
};

export default React.memo(AllValidatorPage);

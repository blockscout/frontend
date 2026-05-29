// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

import config from 'src/config';

const validatorsFeature = config.features.validators;

const Validators = dynamic(() => {
  if (validatorsFeature.isEnabled && validatorsFeature.chainType === 'stability') {
    return import('src/features/chain-variants/stability/pages/validator-index/ValidatorsStability');
  }

  if (validatorsFeature.isEnabled && validatorsFeature.chainType === 'blackfort') {
    return import('src/features/chain-variants/blackfort/pages/validator-index/ValidatorsBlackfort');
  }

  if (validatorsFeature.isEnabled && validatorsFeature.chainType === 'zilliqa') {
    return import('src/features/chain-variants/zilliqa/pages/validator-index/ValidatorsZilliqa');
  }

  throw new Error('Validators feature is not enabled.');
}, { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/validators">
      <Validators/>
    </PageNextJs>
  );
};

export default Page;

export { validators as getServerSideProps } from 'src/server/getServerSideProps/main';

// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import config from 'client/config';
import { useRouter } from 'next/router';
import React from 'react';

import type { EssentialDappsConfig } from 'client/features/marketplace/types/client';

import PageTitle from 'client/shell/page/title/PageTitle';

import getQueryParamString from 'client/shared/router/get-query-param-string';

import useAutoConnectWallet from '../../hooks/useAutoConnectWallet';
import Multisend from './multisend/Multisend';
import Revoke from './revoke/Revoke';
import Swap from './swap/Swap';

const feature = config.features.marketplace;

const EssentialDapp = () => {
  const router = useRouter();
  useAutoConnectWallet();

  const id = getQueryParamString(router.query.id);

  let title = null;
  let content = null;
  let isCentered = false;

  switch (id) {
    case 'swap':
      title = 'Swap';
      content = <Swap/>;
      isCentered = true;
      break;
    case 'revoke':
      title = 'Revoke';
      content = <Revoke/>;
      break;
    case 'multisend':
      title = 'Multisend';
      content = <Multisend/>;
      isCentered = true;
      break;
  }

  if (!content || (feature.isEnabled && !feature.essentialDapps?.[id as keyof EssentialDappsConfig])) {
    throw new Error('Essential dapp not found', { cause: { status: 404 } });
  }

  return (
    <Flex flexDir="column" h="full" w="full">
      <PageTitle title={ title || '' } alignItems={ isCentered ? 'center' : undefined }/>
      { content }
    </Flex>
  );
};

export default EssentialDapp;

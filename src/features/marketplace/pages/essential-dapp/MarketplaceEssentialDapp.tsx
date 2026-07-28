// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { EssentialDappsConfig } from 'src/features/marketplace/types/client';

import PageTitle from 'src/shell/page/title/PageTitle';

import { ensureLoaded as ensureWeb3Runtime } from 'src/features/connect-wallet/utils/runtime';

import config from 'src/config';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import useAutoConnectWallet from '../../hooks/useAutoConnectWallet';
import Multisend from './multisend/Multisend';
import Revoke from './revoke/Revoke';
import Swap from './swap/Swap';

const feature = config.features.marketplace;

const EssentialDapp = () => {
  const router = useRouter();
  useAutoConnectWallet();

  // Route-eager wallet load: essential dapps (swap/revoke/multisend) all need the wallet, and honour
  // `?action=connect`, so start the runtime at mount rather than waiting for the boot-time idle trigger.
  React.useEffect(() => {
    ensureWeb3Runtime();
  }, []);

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

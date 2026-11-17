// SPDX-License-Identifier: LicenseRef-Blockscout

import { VStack } from '@chakra-ui/react';
import React from 'react';

import type { Screen } from '../types';

import * as analytics from 'src/shared/analytics';

import { Button } from 'src/toolkit/chakra/button';

interface Props {
  onSelectMethod: (screen: Screen) => void;
}

const AuthModalScreenSelectMethod = ({ onSelectMethod }: Props) => {

  const handleEmailClick = React.useCallback(() => {
    analytics.logEvent(analytics.EventTypes.LOGIN, {
      Action: 'Email',
      Source: 'Options selector',
    });
    onSelectMethod({ type: 'email' });
  }, [ onSelectMethod ]);

  const handleConnectWalletClick = React.useCallback(() => {
    analytics.logEvent(analytics.EventTypes.LOGIN, {
      Action: 'Wallet',
      Source: 'Options selector',
    });
    onSelectMethod({ type: 'connect_wallet', loginToRewards: true });
  }, [ onSelectMethod ]);

  return (
    <VStack gap={ 3 } mt={ 4 } align="stretch">
      <Button variant="outline" onClick={ handleConnectWalletClick }>Continue with Web3 wallet</Button>
      <Button variant="outline" onClick={ handleEmailClick }>Continue with email</Button>
    </VStack>
  );
};

export default React.memo(AuthModalScreenSelectMethod);

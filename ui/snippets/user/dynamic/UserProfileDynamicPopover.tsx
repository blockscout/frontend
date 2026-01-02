import { DynamicConnectButton, useAuthenticateConnectedUser } from '@dynamic-labs/sdk-react-core';
import React from 'react';

import { Button } from 'toolkit/chakra/button';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';

import UserProfileContentWallet from '../profile/UserProfileContentWallet';
import UserWalletAutoConnectAlert from '../UserWalletAutoConnectAlert';
import styles from './UserProfileDynamicPopover.module.css';

interface Props {
  children: React.ReactNode;
  isAutoConnectDisabled: boolean;
}

const UserProfileDynamicPopover = ({ children, isAutoConnectDisabled }: Props) => {

  const { authenticateUser } = useAuthenticateConnectedUser();

  return (
    <PopoverRoot positioning={{ placement: 'bottom-end' }}>
      <PopoverTrigger>
        { children }
      </PopoverTrigger>
      <PopoverContent w="280px">
        <PopoverBody>
          { isAutoConnectDisabled && <UserWalletAutoConnectAlert/> }
          <UserProfileContentWallet/>
          <DynamicConnectButton buttonClassName={ styles.button }>
            <Button as="div" mt={ 3 } onClick={ authenticateUser } size="sm" w="100%" >Log in</Button>
          </DynamicConnectButton>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(UserProfileDynamicPopover);

import { type ButtonProps } from '@chakra-ui/react';
import { DynamicConnectButton, DynamicUserProfile, useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import useWallet from 'lib/web3/useWallet';

import UserProfileDynamicButton from './UserProfileDynamicButton';

interface Props {
  buttonSize?: ButtonProps['size'];
  buttonVariant?: ButtonProps['variant'];
}

// TODO @tom2drum add ENS support
// TODO @tom2drum restructure folder
const UserProfileDynamic = ({ buttonSize, buttonVariant = 'header' }: Props) => {
  const isMobile = useIsMobile();
  const isLoggedIn = useIsLoggedIn();
  const { user, authMode } = useDynamicContext();
  const wallet = useWallet({ source: 'Profile dropdown' });

  const handleOpenModal = React.useCallback(() => {
    wallet.openModal();
  }, [ wallet ]);

  if (isLoggedIn && authMode === 'connect-and-sign') {
    return (
      <>
        <UserProfileDynamicButton
          address={ wallet.address }
          email={ user?.email }
          size={ buttonSize }
          variant={ buttonVariant }
          onClick={ handleOpenModal }
          selected
        />
        <DynamicUserProfile variant={ isMobile ? 'modal' : 'dropdown' }/>
      </>
    );
  }

  if (wallet.isConnected && wallet.address) {
    return (
      <>
        <UserProfileDynamicButton
          address={ wallet.address }
          email={ user?.email }
          size={ buttonSize }
          variant={ buttonVariant }
          onClick={ handleOpenModal }
          selected
        />
        <DynamicUserProfile variant={ isMobile ? 'modal' : 'dropdown' }/>
      </>
    );
    // return (
    //   <UserProfileDynamicPopover isAutoConnectDisabled={ isAutoConnectDisabled }>
    //     <UserProfileDynamicButton
    //       address={ wallet.address }
    //       email={ user?.email }
    //       size={ buttonSize }
    //       variant={ buttonVariant }
    //       selected
    //     />
    //   </UserProfileDynamicPopover>
    // );
  }

  return (
    <DynamicConnectButton>
      <UserProfileDynamicButton
        as="div"
        size={ buttonSize }
        variant={ buttonVariant }
      />
    </DynamicConnectButton>
  );
};

export default React.memo(UserProfileDynamic);

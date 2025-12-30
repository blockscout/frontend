import { Box, HStack, type ButtonProps } from '@chakra-ui/react';
import { DynamicConnectButton, DynamicUserProfile, useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import React from 'react';

import { useMarketplaceContext } from 'lib/contexts/marketplace';
import shortenString from 'lib/shortenString';
import { Button } from 'toolkit/chakra/button';
import IconSvg from 'ui/shared/IconSvg';

import { getUserHandle } from '../profile/utils';
import UserIdenticon from '../UserIdenticon';

interface Props {
  buttonSize?: ButtonProps['size'];
  buttonVariant?: ButtonProps['variant'];
}

const UserProfileDynamic = ({ buttonSize, buttonVariant = 'header' }: Props) => {
  const isLoggedIn = useIsLoggedIn();
  const { setShowDynamicUserProfile, primaryWallet, user } = useDynamicContext();
  const { isAutoConnectDisabled } = useMarketplaceContext();

  const handleMyProfileClick = React.useCallback(() => {
    setShowDynamicUserProfile(true);
  }, [ setShowDynamicUserProfile ]);

  if (isLoggedIn) {
    const address = primaryWallet?.address;
    const content = address ? (
      <HStack gap={ 2 }>
        <UserIdenticon address={ address } isAutoConnectDisabled={ isAutoConnectDisabled }/>
        <Box display={{ base: 'none', md: 'block' }}>
          { shortenString(address) }
        </Box>
      </HStack>
    ) : (
      <HStack gap={ 2 }>
        <IconSvg name="profile" boxSize={ 5 }/>
        <Box display={{ base: 'none', md: 'block' }}>{ user?.email ? getUserHandle(user.email) : 'My profile' }</Box>
      </HStack>
    );

    return (
      <>
        <Button
          size={ buttonSize }
          variant={ buttonVariant }
          px={{ base: 2.5, lg: 3 }}
          onClick={ handleMyProfileClick }
          selected
          highlighted={ isAutoConnectDisabled }
          fontWeight={ 700 }
        >
          { content }
        </Button>
        <DynamicUserProfile variant="dropdown"/>
      </>
    );
  }

  return (
    <DynamicConnectButton>
      <Button
        as="div"
        size={ buttonSize }
        variant={ buttonVariant }
        px={{ base: 2.5, lg: 3 }}
      >
        Log in
      </Button>
    </DynamicConnectButton>
  );
};

export default React.memo(UserProfileDynamic);

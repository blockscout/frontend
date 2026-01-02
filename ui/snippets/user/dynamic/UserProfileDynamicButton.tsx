import { Box, HStack } from '@chakra-ui/react';
import React from 'react';

import { useMarketplaceContext } from 'lib/contexts/marketplace';
import shortenString from 'lib/shortenString';
import { Button, type ButtonProps } from 'toolkit/chakra/button';
import IconSvg from 'ui/shared/IconSvg';

import { getUserHandle } from '../profile/utils';
import UserIdenticon from '../UserIdenticon';

interface Props extends ButtonProps {
  address?: string;
  email?: string;
}

const UserProfileDynamicButton = ({ selected, address, email, ...rest }: Props) => {
  const { isAutoConnectDisabled } = useMarketplaceContext();

  const content = (() => {
    if (selected) {
      return address ? (
        <HStack gap={ 2 }>
          <UserIdenticon address={ address } isAutoConnectDisabled={ isAutoConnectDisabled }/>
          <Box display={{ base: 'none', md: 'block' }}>
            { shortenString(address) }
          </Box>
        </HStack>
      ) : (
        <HStack gap={ 2 }>
          <IconSvg name="profile" boxSize={ 5 }/>
          <Box display={{ base: 'none', md: 'block' }}>{ email ? getUserHandle(email) : 'My profile' }</Box>
        </HStack>
      );
    }

    return 'Log in';
  })();

  return (
    <Button
      px={{ base: 2.5, lg: 3 }}
      selected={ selected }
      highlighted={ isAutoConnectDisabled }
      fontWeight={ selected ? 700 : undefined }
      { ...rest }
    >
      { content }
    </Button>
  );
};

export default React.memo(UserProfileDynamicButton);

import { Center, useColorModeValue, chakra } from '@chakra-ui/react';
import React from 'react';
import Identicon from 'react-identicons';

import useIsMobile from 'lib/hooks/useIsMobile';

const ProfileIcon = chakra(Identicon);

const ProfileMenu = () => {
  const isMobile = useIsMobile();

  const size = isMobile ? '24px' : '50px';

  return (
    <Center
      flexShrink={ 0 }
      padding={ isMobile ? 2 : 0 }
    >
      { /* the displayed size is 48px, but we need to generate x2 for retina displays */ }
      <ProfileIcon
        maxWidth={ size }
        maxHeight={ size }
        string="randomness"
        size={ 100 }
        bg={ useColorModeValue('blackAlpha.100', 'white') }
        borderRadius="50%"
        overflow="hidden"
      />
    </Center>
  );
};

export default ProfileMenu;

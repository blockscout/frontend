import { useColorModeValue, chakra } from '@chakra-ui/react';
import React from 'react';
import Identicon from 'react-identicons';

const ProfileIcon = chakra(Identicon);

interface Props {
  size: number;
}

const UserAvatar = ({ size }: Props) => {
  const sizeString = `${ size }px`;

  return (
    <ProfileIcon
      flexShrink={ 0 }
      maxWidth={ sizeString }
      maxHeight={ sizeString }
      string="randomness"
      // the displayed size is doubled for retina displays
      size={ size * 2 }
      bg={ useColorModeValue('blackAlpha.100', 'white') }
      borderRadius="50%"
      overflow="hidden"
    />
  );
};

export default React.memo(UserAvatar);

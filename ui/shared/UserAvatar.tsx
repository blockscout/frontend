import { useColorModeValue, chakra, Box, Image } from '@chakra-ui/react';
import React from 'react';
import Identicon from 'react-identicons';

import type { UserInfo } from 'types/api/account';

import * as cookies from 'lib/cookies';
import { useAppContext } from 'lib/next/AppWrapper';

const ProfileIcon = chakra(Identicon);

interface Props {
  size: number;
  data?: UserInfo;
  isFetched: boolean;
}

const UserAvatar = ({ size, data, isFetched }: Props) => {
  const appProps = useAppContext();
  const hasAuth = Boolean(cookies.getFromCookieString(appProps.cookies, cookies.NAMES.API_TOKEN));

  const sizeString = `${ size }px`;
  const bgColor = useColorModeValue('blackAlpha.100', 'white');

  // if (hasAuth && !isFetched) {

  // }

  if (hasAuth && !isFetched) {
    return <Box w={ sizeString } h={ sizeString }></Box>;
  }

  if (data?.avatar) {
    return (
      <Image
        flexShrink={ 0 }
        src={ data.avatar }
        alt={ `Profile picture of ${ data?.name || data?.nickname || '' }` }
        w={ sizeString }
        minW={ sizeString }
        h={ sizeString }
        minH={ sizeString }
        borderRadius="full"
        overflow="hidden"
      />
    );
  }

  return (
    <ProfileIcon
      flexShrink={ 0 }
      maxWidth={ sizeString }
      maxHeight={ sizeString }
      string={ data?.email || 'randomness' }
      // the displayed size is doubled for retina displays
      size={ size * 2 }
      bg={ bgColor }
      borderRadius="full"
      overflow="hidden"
    />
  );
};

export default React.memo(UserAvatar);

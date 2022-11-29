import { useColorModeValue, useToken, SkeletonCircle, Image, Box } from '@chakra-ui/react';
import React from 'react';
import Identicon from 'react-identicons';

import type { UserInfo } from 'types/api/account';

import { useAppContext } from 'lib/appContext';
import * as cookies from 'lib/cookies';

const IdenticonComponent = typeof Identicon === 'object' && 'default' in Identicon ? Identicon.default : Identicon;

// for those who haven't got profile
// or if we cannot download the profile picture for some reasons
const FallbackImage = ({ size, id }: { size: number; id: string }) => {
  const bgColor = useToken('colors', useColorModeValue('gray.100', 'white'));

  return (
    <Box
      flexShrink={ 0 }
      maxWidth={ `${ size }px` }
      maxHeight={ `${ size }px` }
    >
      <Box boxSize={ `${ size * 2 }px` } transformOrigin="left top" transform="scale(0.5)" borderRadius="full" overflow="hidden">
        <IdenticonComponent
          bg={ bgColor }
          string={ id }
          // the displayed size is doubled for retina displays and then scaled down
          size={ size * 2 }
        />
      </Box>
    </Box>
  );
};

interface Props {
  size: number;
  data?: UserInfo;
  isFetched: boolean;
}

const UserAvatar = ({ size, data, isFetched }: Props) => {
  const appProps = useAppContext();
  const hasAuth = Boolean(cookies.get(cookies.NAMES.API_TOKEN, appProps.cookies));
  const [ isImageLoadError, setImageLoadError ] = React.useState(false);

  const sizeString = `${ size }px`;

  const handleImageLoadError = React.useCallback(() => {
    setImageLoadError(true);
  }, []);

  if (hasAuth && !isFetched) {
    return <SkeletonCircle h={ sizeString } w={ sizeString }/>;
  }

  return (
    <Image
      flexShrink={ 0 }
      src={ data?.avatar }
      alt={ `Profile picture of ${ data?.name || data?.nickname || '' }` }
      w={ sizeString }
      minW={ sizeString }
      h={ sizeString }
      minH={ sizeString }
      borderRadius="full"
      overflow="hidden"
      fallback={ isImageLoadError || !data?.avatar ? <FallbackImage size={ size } id={ data?.email || 'randomness' }/> : undefined }
      onError={ handleImageLoadError }
    />
  );
};

export default React.memo(UserAvatar);

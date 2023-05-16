import { Image, chakra, useColorModeValue, Icon, Skeleton } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import tokenPlaceholderIcon from 'icons/token-placeholder.svg';

const EmptyElement = ({ className }: { className?: string }) => {
  const bgColor = useColorModeValue('gray.200', 'gray.600');
  const color = useColorModeValue('gray.400', 'gray.200');

  return (
    <Icon
      className={ className }
      fontWeight={ 600 }
      bgColor={ bgColor }
      color={ color }
      borderRadius="base"
      as={ tokenPlaceholderIcon }
      transitionProperty="background-color,color"
      transitionDuration="normal"
      transitionTimingFunction="ease"
    />
  );
};

interface Props {
  hash?: string;
  name?: string | null;
  className?: string;
  isLoading?: boolean;
}

const TokenLogo = ({ hash, name, className, isLoading }: Props) => {

  if (isLoading) {
    return <Skeleton className={ className } borderRadius="base" flexShrink={ 0 }/>;
  }

  const logoSrc = appConfig.network.assetsPathname && hash ? [
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/',
    appConfig.network.assetsPathname,
    '/assets/',
    hash,
    '/logo.png',
  ].join('') : undefined;

  return (
    <Image
      borderRadius="base"
      className={ className }
      src={ logoSrc }
      alt={ `${ name || 'token' } logo` }
      fallback={ <EmptyElement className={ className }/> }
    />
  );
};

export default React.memo(chakra(TokenLogo));

import { Image, Center, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';

const EmptyElement = ({ className, letter }: { className?: string; letter: string }) => {
  const bgColor = useColorModeValue('gray.200', 'gray.600');
  const color = useColorModeValue('gray.400', 'gray.200');

  return (
    <Center
      className={ className }
      fontWeight={ 600 }
      bgColor={ bgColor }
      color={ color }
      borderRadius="base"
    >
      { letter.toUpperCase() }
    </Center>
  );
};

interface Props {
  hash?: string;
  name?: string | null;
  className?: string;
}

const TokenLogo = ({ hash, name, className }: Props) => {
  const logoSrc = appConfig.network.assetsPathname && hash ? [
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/',
    appConfig.network.assetsPathname,
    '/assets/',
    hash,
    '/logo.png',
  ].join('') : undefined;

  return (
    <Image
      className={ className }
      src={ logoSrc }
      alt={ `${ name || 'token' } logo` }
      fallback={ <EmptyElement className={ className } letter={ name?.slice(0, 1) || 'U' }/> }
    />
  );
};

export default React.memo(chakra(TokenLogo));

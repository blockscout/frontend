import { Image, chakra, Skeleton } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import TokenLogoPlaceholder from 'ui/shared/TokenLogoPlaceholder';

interface Props {
  hash?: string;
  name?: string | null;
  className?: string;
  isLoading?: boolean;
}

const TokenLogo = ({ hash, name, className, isLoading }: Props) => {

  if (isLoading) {
    return <Skeleton className={ className } borderRadius="base"/>;
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
      fallback={ <TokenLogoPlaceholder className={ className }/> }
    />
  );
};

export default React.memo(chakra(TokenLogo));

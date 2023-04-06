import { Image, chakra } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import TokenLogoPlaceholder from 'ui/shared/TokenLogoPlaceholder';

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
      borderRadius="base"
      className={ className }
      src={ logoSrc }
      alt={ `${ name || 'token' } logo` }
      fallback={ <TokenLogoPlaceholder className={ className }/> }
    />
  );
};

export default React.memo(chakra(TokenLogo));

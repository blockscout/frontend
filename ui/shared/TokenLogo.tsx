import { Image, chakra } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';

const EmptyElement = () => null;

interface Props {
  hash: string;
  name?: string;
  className?: string;
}

const TokenLogo = ({ hash, name, className }: Props) => {
  const logoSrc = `
    https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/
    ${ appConfig.network.assetsPathname || appConfig.network.type }
    /assets/
    ${ hash }
    /logo.png
  `;

  return <Image className={ className } src={ logoSrc } alt={ `${ name || 'token' } logo` } fallback={ <EmptyElement/> }/>;
};

export default React.memo(chakra(TokenLogo));

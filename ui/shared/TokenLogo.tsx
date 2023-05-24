import { Image, chakra, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import appConfig from 'configs/app/config';
import TokenLogoPlaceholder from 'ui/shared/TokenLogoPlaceholder';

export interface Props {
  data?: Pick<TokenInfo, 'address' | 'icon_url' | 'name'>;
  className?: string;
  isLoading?: boolean;
}

const TokenLogo = ({ className, isLoading, data }: Props) => {

  if (isLoading) {
    return <Skeleton className={ className } borderRadius="base" flexShrink={ 0 }/>;
  }

  const logoSrc = (() => {
    if (data?.icon_url) {
      return data.icon_url;
    }

    if (appConfig.network.assetsPathname && data?.address) {
      return [
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/',
        appConfig.network.assetsPathname,
        '/assets/',
        data.address,
        '/logo.png',
      ].join('');
    }
  })();

  return (
    <Image
      borderRadius="base"
      className={ className }
      src={ logoSrc }
      alt={ `${ data?.name || 'token' } logo` }
      fallback={ <TokenLogoPlaceholder className={ className }/> }
    />
  );
};

export default React.memo(chakra(TokenLogo));

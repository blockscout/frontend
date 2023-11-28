import { Image, Skeleton, chakra } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import TokenLogoPlaceholder from 'ui/shared/TokenLogoPlaceholder';

export interface Props {
  data?: Pick<TokenInfo, | 'icon_url' | 'name'>;
  className?: string;
  isLoading?: boolean;
}

const TokenLogo = ({ className, isLoading, data }: Props) => {

  if (isLoading) {
    return <Skeleton className={ className } borderRadius="base" flexShrink={ 0 }/>;
  }

  return (
    <Image
      borderRadius="base"
      className={ className }
      src={ data?.icon_url ?? undefined }
      alt={ `${ data?.name || 'token' } logo` }
      fallback={ <TokenLogoPlaceholder bgColor="divider" className={ className }/> }
    />
  );
};

export default React.memo(chakra(TokenLogo));

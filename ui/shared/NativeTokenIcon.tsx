import { Skeleton, Image, chakra } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { HOMEPAGE_STATS } from 'stubs/stats';

import TokenLogoPlaceholder from './TokenLogoPlaceholder';

type Props = {
  isLoading?: boolean;
  className?: string;
  type?: 'primary' | 'secondary';
}

const NativeTokenIcon = ({ isLoading, className, type }: Props) => {
  const statsQueryResult = useApiQuery('stats', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: HOMEPAGE_STATS,
    },
  });

  if (isLoading || statsQueryResult.isPlaceholderData) {
    return <Skeleton borderRadius="base" className={ className }/>;
  }

  const src = type === 'secondary' ? statsQueryResult.data?.secondary_coin_image : statsQueryResult.data?.coin_image;

  return (
    <Image
      borderRadius="base"
      className={ className }
      src={ src || '' }
      alt={ `${ config.chain.currency.symbol } logo` }
      fallback={ <TokenLogoPlaceholder borderRadius="base" className={ className }/> }
      fallbackStrategy={ src ? 'onError' : 'beforeLoadOrError' }
    />
  );
};

export default chakra(NativeTokenIcon);

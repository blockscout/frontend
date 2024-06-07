import { Skeleton, Image, chakra } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { HOMEPAGE_STATS } from 'stubs/stats';

import TokenLogoPlaceholder from './TokenLogoPlaceholder';

type Props = {
  isLoading?: boolean;
  className?: string;
}

const NativeTokenIcon = (props: Props) => {
  const statsQueryResult = useApiQuery('stats', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: HOMEPAGE_STATS,
    },
  });

  if (props.isLoading || statsQueryResult.isPlaceholderData) {
    return <Skeleton borderRadius="base" className={ props.className }/>;
  }

  return (
    <Image
      borderRadius="base"
      className={ props.className }
      src={ statsQueryResult.data?.coin_image || '' }
      alt={ `${ config.chain.currency.symbol } logo` }
      fallback={ <TokenLogoPlaceholder borderRadius="base" className={ props.className }/> }
      fallbackStrategy={ statsQueryResult.data?.coin_image ? 'onError' : 'beforeLoadOrError' }
    />
  );
};

export default chakra(NativeTokenIcon);

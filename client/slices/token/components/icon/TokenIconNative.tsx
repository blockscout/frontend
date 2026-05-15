// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'client/api/hooks/useApiQuery';

import { HOMEPAGE_STATS } from 'client/slices/home/stubs';
import TokenIconPlaceholder from 'client/slices/token/components/icon/TokenIconPlaceholder';

import config from 'configs/app';
import { Image } from 'toolkit/chakra/image';
import { Skeleton } from 'toolkit/chakra/skeleton';

type Props = {
  isLoading?: boolean;
  className?: string;
  type?: 'primary' | 'secondary';
};

const TokenIconNative = ({ isLoading, className, type }: Props) => {
  const statsQueryResult = useApiQuery('general:stats', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: HOMEPAGE_STATS,
    },
  });

  if (isLoading || statsQueryResult.isPlaceholderData) {
    return <Skeleton borderRadius="base" loading className={ className }/>;
  }

  const src = type === 'secondary' ? statsQueryResult.data?.secondary_coin_image : statsQueryResult.data?.coin_image;

  return (
    <Image
      className={ className }
      borderRadius="base"
      src={ src || undefined }
      alt={ `${ config.chain.currency.symbol } logo` }
      fallback={ <TokenIconPlaceholder/> }
    />
  );
};

export default chakra(TokenIconNative);

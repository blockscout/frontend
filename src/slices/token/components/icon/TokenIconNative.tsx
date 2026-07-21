// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import useStatsQuery from 'src/slices/chain/stats/useStatsQuery';
import TokenIconPlaceholder from 'src/slices/token/components/icon/TokenIconPlaceholder';

import config from 'src/config';

import { Image } from 'src/toolkit/chakra/image';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

type Props = {
  isLoading?: boolean;
  className?: string;
  type?: 'primary' | 'secondary';
};

const TokenIconNative = ({ isLoading, className, type }: Props) => {
  const statsQueryResult = useStatsQuery();

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

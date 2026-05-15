// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { HomeStats } from 'client/slices/home/types/api';

import TokenLogoPlaceholder from 'client/slices/token/components/icon/TokenIconPlaceholder';

import { Image } from 'toolkit/chakra/image';
import { Skeleton } from 'toolkit/chakra/skeleton';

import useFetchParentChainApi from '../home/useFetchParentChainApi';

interface Props {
  isLoading?: boolean;
  className?: string;
};

const NativeTokenIcon = ({ isLoading, className }: Props) => {
  const parentChainApiFetch = useFetchParentChainApi();
  const parentChainStatsQuery = useQuery({
    queryKey: [ 'parent_chain', 'stats' ],
    queryFn: () => parentChainApiFetch({ path: '/stats' }) as Promise<HomeStats>,
    refetchOnMount: false,
  });

  if (isLoading || parentChainStatsQuery.isFetching) {
    return <Skeleton borderRadius="base" loading className={ className }/>;
  }

  return (
    <Image
      className={ className }
      borderRadius="base"
      src={ parentChainStatsQuery.data?.coin_image || undefined }
      alt="Native token logo"
      fallback={ <TokenLogoPlaceholder/> }
    />
  );
};

export default chakra(NativeTokenIcon);

// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, Flex } from '@chakra-ui/react';
import React from 'react';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  readonly label: string;
  readonly isLoading: boolean;
  readonly children: React.ReactNode;
}

const TxReceiptRow = ({ label, isLoading, children }: Props) => {
  return (
    <Flex alignItems="flex-start" justifyContent="space-between" columnGap={ 4 } py={ 0.5 }>
      <chakra.dt flexShrink={ 0 }>{ label }</chakra.dt>
      <Skeleton loading={ isLoading } asChild>
        <chakra.dd minW={ 0 } textAlign="right">
          { children }
        </chakra.dd>
      </Skeleton>
    </Flex>
  );
};

export default React.memo(TxReceiptRow);

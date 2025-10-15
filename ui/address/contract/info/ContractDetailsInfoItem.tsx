import type { BoxProps } from '@chakra-ui/react';
import { chakra, Flex, GridItem } from '@chakra-ui/react';
import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { Hint } from 'toolkit/components/Hint/Hint';

interface Props {
  label: string;
  children: React.ReactNode;
  className?: string;
  isLoading: boolean;
  hint?: string;
  contentProps?: BoxProps;
}

const ContractDetailsInfoItem = ({ label, children, className, isLoading, hint, contentProps }: Props) => {
  return (
    <GridItem display="flex" columnGap={ 6 } wordBreak="break-all" className={ className } alignItems="baseline" maxW="100%" overflow="hidden">
      <Skeleton loading={ isLoading } w="170px" flexShrink={ 0 } fontWeight={ 500 }>
        <Flex alignItems="center">
          { label }
          { hint && <Hint label={ hint } ml={ 2 }/> }
        </Flex>
      </Skeleton>
      <Skeleton loading={ isLoading } { ...contentProps }>{ children }</Skeleton>
    </GridItem>
  );
};

export default React.memo(chakra(ContractDetailsInfoItem));

import { chakra, GridItem, Flex, Skeleton } from '@chakra-ui/react';
import React from 'react';

import Hint from 'ui/shared/Hint';

interface LabelProps {
  hint?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  id?: string;
}

const Label = chakra(({ hint, children, isLoading, id, className }: LabelProps) => {
  return (
    <GridItem
      id={ id }
      className={ className }
      py={ 1 }
      lineHeight={{ base: 5, lg: 6 }}
      _notFirst={{ mt: { base: 3, lg: 0 } }}
    >
      <Flex columnGap={ 2 } alignItems="flex-start">
        { hint && <Hint label={ hint } isLoading={ isLoading } my={{ lg: '2px' }}/> }
        <Skeleton isLoaded={ !isLoading } fontWeight={{ base: 700, lg: 500 }}>
          { children }
        </Skeleton>
      </Flex>
    </GridItem>
  );
});

interface ValueProps {
  children: React.ReactNode;
  className?: string;
}

const Value = chakra(({ children, className }: ValueProps) => {
  return (
    <GridItem
      className={ className }
      display="flex"
      alignItems="center"
      flexWrap="wrap"
      rowGap={ 3 }
      pl={{ base: 7, lg: 0 }}
      py={ 1 }
      lineHeight={{ base: 5, lg: 6 }}
      whiteSpace="nowrap"
    >
      { children }
    </GridItem>
  );
});

export {
  Label,
  Value,
};

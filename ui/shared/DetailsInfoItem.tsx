import { chakra, GridItem, Flex, Text, Skeleton } from '@chakra-ui/react';
import React from 'react';

import * as ContainerWithScrollY from 'ui/shared/ContainerWithScrollY';
import Hint from 'ui/shared/Hint';
import HintPopover from 'ui/shared/HintPopover';

const LabelScrollText = () => (
  <Text fontWeight={ 500 } variant="secondary" fontSize="xs" className="note" align="right">
    Scroll to see more
  </Text>
);

interface LabelProps {
  hint?: React.ReactNode;
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  id?: string;
  hasScroll?: boolean;
  type?: 'tooltip' | 'popover';
}

const Label = chakra(({ hint, children, isLoading, id, className, hasScroll, type }: LabelProps) => {
  return (
    <GridItem
      id={ id }
      className={ className }
      py={ 1 }
      lineHeight={{ base: 5, lg: 6 }}
      _notFirst={{ mt: { base: 3, lg: 0 } }}
    >
      <Flex columnGap={ 2 } alignItems="flex-start">
        { hint && (type === 'popover' ?
          <HintPopover label={ hint } isLoading={ isLoading } my={{ lg: '2px' }}/> :
          <Hint label={ hint } isLoading={ isLoading } my={{ lg: '2px' }}/>) }
        <Skeleton isLoaded={ !isLoading } fontWeight={{ base: 700, lg: 500 }}>
          { children }
          { hasScroll && <LabelScrollText/> }
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

const ValueWithScroll = chakra(({ children, gradientHeight, onScrollVisibilityChange, className }: ContainerWithScrollY.Props) => {
  return (
    <Value position="relative">
      <ContainerWithScrollY.default
        className={ className }
        gradientHeight={ gradientHeight }
        onScrollVisibilityChange={ onScrollVisibilityChange }
      >
        { children }
      </ContainerWithScrollY.default>
    </Value>
  );
});

export {
  Label,
  Value,
  ValueWithScroll,
};

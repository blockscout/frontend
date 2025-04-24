import type { GridItemProps, GridProps } from '@chakra-ui/react';
import { Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { Hint } from 'toolkit/components/Hint/Hint';
import * as ContainerWithScrollY from 'ui/shared/ContainerWithScrollY';

export const Container = (props: GridProps) => {
  return (
    <Grid
      columnGap={ 8 }
      rowGap={{ base: 1, lg: 3 }}
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }}
      { ...props }
    />
  );
};

interface ItemLabelProps extends GridItemProps {
  hint?: React.ReactNode;
  children: React.ReactNode;
  isLoading?: boolean;
  id?: string;
  hasScroll?: boolean;
}

const ItemLabelScrollText = () => (
  <Text fontWeight={ 500 } color="text.secondary" textStyle="xs" className="note" textAlign="right">
    Scroll to see more
  </Text>
);

export const ItemLabel = ({ hint, children, isLoading, id, hasScroll, ...rest }: ItemLabelProps) => {
  return (
    <GridItem
      id={ id }
      py={ 1 }
      textStyle="md"
      _notFirst={{ mt: { base: 3, lg: 0 } }}
      { ...rest }
    >
      <Flex columnGap={ 2 } alignItems="flex-start">
        { hint && <Hint label={ hint } isLoading={ isLoading } my="2px"/> }
        <Skeleton loading={ isLoading } fontWeight={{ base: 700, lg: 500 }}>
          { children }
          { hasScroll && <ItemLabelScrollText/> }
        </Skeleton>
      </Flex>
    </GridItem>
  );
};

interface ItemValueProps extends GridItemProps {
  children: React.ReactNode;
}

export const ItemValue = ({ children, ...rest }: ItemValueProps) => {
  return (
    <GridItem
      display="flex"
      alignItems="center"
      flexWrap="wrap"
      rowGap={ 3 }
      pl={{ base: 7, lg: 0 }}
      py={ 1 }
      textStyle="md"
      whiteSpace="nowrap"
      { ...rest }
    >
      { children }
    </GridItem>
  );
};

export const ItemValueWithScroll = ({ children, gradientHeight, onScrollVisibilityChange, ...rest }: ContainerWithScrollY.Props) => {
  return (
    <ItemValue position="relative" >
      <ContainerWithScrollY.default
        { ...rest }
        gradientHeight={ gradientHeight }
        onScrollVisibilityChange={ onScrollVisibilityChange }
      >
        { children }
      </ContainerWithScrollY.default>
    </ItemValue>
  );
};

export const ItemDivider = (props: GridItemProps) => {
  const { colSpan = { base: undefined, lg: 2 }, ...rest } = props;
  return (
    <GridItem
      colSpan={ colSpan }
      mt={{ base: 2, lg: 3 }}
      mb={{ base: 0, lg: 3 }}
      borderBottom="1px solid"
      borderColor="border.divider"
      { ...rest }
    />
  );
};

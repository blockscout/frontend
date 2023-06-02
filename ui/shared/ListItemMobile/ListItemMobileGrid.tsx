import { Grid, chakra, GridItem, Skeleton } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';

interface ContainerProps {
  className?: string;
  isAnimated?: boolean;
  children: React.ReactNode;
}

const Container = chakra(({ isAnimated, children, className }: ContainerProps) => {
  return (
    <Grid
      as={ motion.div }
      w="100%"
      initial={ isAnimated ? { opacity: 0, scale: 0.97 } : { opacity: 1, scale: 1 } }
      animate={{ opacity: 1, scale: 1 }}
      transitionDuration="normal"
      transitionTimingFunction="linear"
      rowGap={ 2 }
      columnGap={ 2 }
      gridTemplateColumns="86px auto"
      alignItems="start"
      paddingY={ 4 }
      borderColor="divider"
      borderTopWidth="1px"
      _last={{
        borderBottomWidth: '1px',
      }}
      className={ className }
      fontSize="sm"
      lineHeight="20px"
    >
      { children }
    </Grid>
  );
});

interface LabelProps {
  className?: string;
  children: React.ReactNode;
  isLoading?: boolean;
}

const Label = chakra(({ children, className, isLoading }: LabelProps) => {
  return (
    <Skeleton
      className={ className }
      isLoaded={ !isLoading }
      fontWeight={ 500 }
      my="5px"
      justifySelf="start"
    >
      { children }
    </Skeleton>
  );
});

interface ValueProps {
  className?: string;
  children: React.ReactNode;
}

const Value = chakra(({ children, className }: ValueProps) => {
  return (
    <GridItem
      className={ className }
      py="5px"
      color="text_secondary"
      overflow="hidden"
    >
      { children }
    </GridItem>
  );
});

const ListItemMobileGrid = {
  Container,
  Label,
  Value,
};

export default ListItemMobileGrid;

import { Grid, Text, chakra } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';

type Item = {
  name: string;
  value: string | React.ReactNode;
}

interface Props {
  items: Array<Item>;
  className?: string;
  isAnimated?: boolean;
}

const ListItemMobileGrid = ({ isAnimated, items, className }: Props) => {
  return (
    <Grid
      as={ motion.div }
      w="100%"
      initial={ isAnimated ? { opacity: 0, scale: 0.97 } : { opacity: 1, scale: 1 } }
      animate={{ opacity: 1, scale: 1 }}
      transitionDuration="normal"
      transitionTimingFunction="linear"
      rowGap={ 4 }
      columnGap={ 2 }
      gridTemplateColumns="max-content auto"
      paddingY={ 6 }
      borderColor="divider"
      borderTopWidth="1px"
      _last={{
        borderBottomWidth: '1px',
      }}
      className={ className }
      fontSize="sm"
    >
      { items.map(item => Boolean(item.value) && (
        <>
          <Text >{ item.name }</Text>
          { typeof item.value === 'string' ? <Text variant="secondary">{ item.value }</Text> : item.value }
        </>
      )) }
    </Grid>
  );
};

export default chakra(ListItemMobileGrid);

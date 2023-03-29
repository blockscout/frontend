import { Grid, chakra, GridItem } from '@chakra-ui/react';
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
      rowGap={ 2 }
      columnGap={ 2 }
      gridTemplateColumns="86px auto"
      gridTemplateRows="minmax(30px, max-content)"
      paddingY={ 4 }
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
          <GridItem fontWeight={ 500 } lineHeight="30px">{ item.name }</GridItem>
          <GridItem alignSelf="center">
            { typeof item.value === 'string' ? <chakra.span color="text_secondary">{ item.value }</chakra.span> : item.value }
          </GridItem>
        </>
      )) }
    </Grid>
  );
};

export default chakra(ListItemMobileGrid);

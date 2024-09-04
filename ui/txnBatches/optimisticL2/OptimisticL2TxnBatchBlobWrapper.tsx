import { chakra, Grid, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const OptimisticL2TxnBatchBlobWrapper = ({ children, className }: Props) => {
  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.100');
  return (
    <Grid
      className={ className }
      columnGap={ 3 }
      rowGap="10px"
      p={ 4 }
      bgColor={ bgColor }
      gridTemplateColumns="auto 1fr"
      borderRadius="base"
      w="100%"
      fontSize="sm"
      lineHeight={ 5 }
    >
      { children }
    </Grid>
  );
};

export default React.memo(chakra(OptimisticL2TxnBatchBlobWrapper));

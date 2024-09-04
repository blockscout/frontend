import { chakra, Grid, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  isLoading: boolean;
}

const OptimisticL2TxnBatchBlobWrapper = ({ children, className, isLoading }: Props) => {
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
      h={ isLoading ? '140px' : undefined }
      fontSize="sm"
      lineHeight={ 5 }
    >
      { isLoading ? null : children }
    </Grid>
  );
};

export default React.memo(chakra(OptimisticL2TxnBatchBlobWrapper));

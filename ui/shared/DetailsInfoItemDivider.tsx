import { GridItem } from '@chakra-ui/react';
import React from 'react';

const DetailsInfoItemDivider = () => {
  return (
    <GridItem
      colSpan={{ base: undefined, lg: 2 }}
      mt={{ base: 2, lg: 3 }}
      mb={{ base: 0, lg: 3 }}
      borderBottom="1px solid"
      borderColor="divider"
    />
  );
};

export default DetailsInfoItemDivider;

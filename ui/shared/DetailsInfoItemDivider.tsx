import type { GridItemProps } from '@chakra-ui/react';
import { GridItem, chakra } from '@chakra-ui/react';
import React from 'react';

interface Props {
  className?: string;
  id?: string;
  colSpan?: GridItemProps['colSpan'];
}

const DetailsInfoItemDivider = ({ className, id, colSpan }: Props) => {
  return (
    <GridItem
      id={ id }
      className={ className }
      colSpan={ colSpan || { base: undefined, lg: 2 } }
      mt={{ base: 2, lg: 3 }}
      mb={{ base: 0, lg: 3 }}
      borderBottom="1px solid"
      borderColor="border.divider"
    />
  );
};

export default chakra(DetailsInfoItemDivider);

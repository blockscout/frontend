import { GridItem } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const TokenInfoFormSectionHeader = ({ children }: Props) => {
  return (
    <GridItem colSpan={{ base: 1, lg: 2 }} fontFamily="heading" fontSize="lg" fontWeight={ 500 } mt={ 3 }>
      { children }
    </GridItem>
  );
};

export default TokenInfoFormSectionHeader;

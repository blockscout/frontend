import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';

interface Props {
  className?: string;
  children: React.ReactNode;
}

const Address = ({ children, className }: Props) => {
  return <Flex alignItems="center" overflow="hidden" className={ className }>{ children }</Flex>;
};

const AddressChakra = chakra(Address);

export default React.memo(AddressChakra);

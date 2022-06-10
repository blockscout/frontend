import React from 'react';

import {
  // Table,
  // Thead,
  // Tbody,
  // Tfoot,
  Td as ChakraTd,
  Th as ChakraTh,
  // Tr,
  // TableContainer,
} from '@chakra-ui/react';

const firstLastStyle = {
  _first: { paddingLeft: 0 },
  _last: { paddingRight: 0 },
}

export const Th = ({ children }: {children?: React.ReactNode}) => {
  return <ChakraTh textTransform="none" fontSize="sm" fontWeight="normal" { ...firstLastStyle }>{ children }</ChakraTh>
};

export const Td = ({ children }: {children?: React.ReactNode}) => {
  return <ChakraTd fontSize="md" { ...firstLastStyle } verticalAlign="top">{ children }</ChakraTd>
};

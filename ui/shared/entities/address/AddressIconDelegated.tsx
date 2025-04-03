import { Box } from '@chakra-ui/react';
import React from 'react';

import { useColorModeValue } from 'toolkit/chakra/color-mode';

interface Props {
  isVerified: boolean;
}

const AddressIconDelegated = ({ isVerified }: Props) => {
  const bgColor = useColorModeValue('var(--chakra-colors-white)', 'var(--chakra-colors-black)');
  const defaultColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Box position="absolute" boxSize="14px" top="-2px" right="-2px" color={ isVerified ? 'green.500' : defaultColor }>
      <svg
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="14" height="6" rx="2" x="0" y="4" fill={ bgColor }/>
        <rect width="6" height="14" rx="2" x="4" y="0" fill={ bgColor }/>
        <rect width="10" height="2" rx="0.5" x="2" y="6" fill="currentColor"/>
        <rect width="2" height="10" rx="0.5" x="6" y="2" fill="currentColor"/>
      </svg>
    </Box>
  );
};

export default React.memo(AddressIconDelegated);

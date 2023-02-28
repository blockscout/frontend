import { Box, chakra, Tooltip, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

type Props = {
  className?: string;
}

const AddressContractIcon = ({ className }: Props) => {
  const bgColor = useColorModeValue('gray.200', 'gray.600');
  const color = useColorModeValue('gray.400', 'gray.200');

  return (
    <Tooltip label="Contract">
      <Box
        className={ className }
        width="24px"
        minWidth="24px"
        height="24px"
        borderRadius="12px"
        backgroundColor={ bgColor }
        color={ color }
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        fontWeight="700"
        transitionProperty="background-color,color"
        transitionDuration="normal"
        transitionTimingFunction="ease"
      >
          C
      </Box>
    </Tooltip>
  );
};

export default chakra(AddressContractIcon);

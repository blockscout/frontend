import { Box, chakra, Tooltip } from '@chakra-ui/react';
import React from 'react';

type Props = {
  className?: string;
}

const AddressContractIcon = ({ className }: Props) => {
  return (
    <Tooltip label="Contract">
      <Box
        className={ className }
        width="24px"
        height="24px"
        borderRadius="12px"
        backgroundColor="gray.200"
        color="gray.400"
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        fontWeight="700"
      >
          С
      </Box>
    </Tooltip>
  );
};

export default chakra(AddressContractIcon);

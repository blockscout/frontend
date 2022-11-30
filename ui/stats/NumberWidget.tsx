import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

type Props = {
  label: string;
  value: string;
}

const NumberWidget = ({ label, value }: Props) => {
  return (
    <Box
      bg={ useColorModeValue('blue.50', 'blue.800') }
      p={ 3 }
      borderRadius={ 12 }
    >
      <Text
        variant="secondary"
        fontSize="xs"
      >
        { label }
      </Text>

      <Text
        fontWeight={ 500 }
        fontSize="lg"
      >
        { value }
      </Text>
    </Box>
  );
};

export default NumberWidget;
